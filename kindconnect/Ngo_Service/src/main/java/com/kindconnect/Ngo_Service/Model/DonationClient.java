package com.kindconnect.Ngo_Service.Model;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
public class DonationClient {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${donation.service.url}")
    private String donationServiceUrl;

    public void acceptDonation(Long donationId, String jwtToken) {

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", jwtToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        try {
            restTemplate.exchange(
                    donationServiceUrl + "/donations/" + donationId + "/accept",
                    HttpMethod.PUT,
                    request,
                    Void.class
            );
        } catch (HttpClientErrorException.Unauthorized e) {
            throw new RuntimeException("Unauthorized: Invalid NGO token sent to Donation Service");
        }
    }


    public void cancelByNgo(Long donationId, String jwtToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", jwtToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        restTemplate.exchange(
                donationServiceUrl + "/donations/" + donationId + "/cancel-by-ngo",
                HttpMethod.PUT,
                request,
                Void.class
        );
    }

    public String getDonationStatus(Long donationId, String jwtToken) {

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", jwtToken);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                donationServiceUrl + "/donations/" + donationId,
                HttpMethod.GET,
                entity,
                Map.class
        );

        return response.getBody().get("status").toString();
    }

}
