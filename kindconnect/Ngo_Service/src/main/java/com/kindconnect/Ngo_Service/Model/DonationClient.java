package com.kindconnect.Ngo_Service.Model;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class DonationClient {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${donation.service.url}")
    private String donationServiceUrl;

    public void acceptDonation(Long donationId, String jwtToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", jwtToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        restTemplate.exchange(
                donationServiceUrl + "/donations/" + donationId + "/accept",
                HttpMethod.PUT,
                request,
                Void.class
        );
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
}
