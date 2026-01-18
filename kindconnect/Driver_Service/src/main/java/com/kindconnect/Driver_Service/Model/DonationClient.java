package com.kindconnect.Driver_Service.Model;

import com.kindconnect.Driver_Service.DTO.AvailablePickupDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Component
public class DonationClient {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${donation.service.url}")
    private String donationServiceUrl;

    public List<AvailablePickupDto> getAvailablePickups(String jwtToken) {

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization",
                jwtToken.startsWith("Bearer ")
                        ? jwtToken
                        : "Bearer " + jwtToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<AvailablePickupDto[]> response =
                restTemplate.exchange(
                        donationServiceUrl + "/donations/available-for-driver",
                        HttpMethod.GET,
                        request,
                        AvailablePickupDto[].class
                );

        return List.of(response.getBody());
    }

    public void pickupDonation(Long donationId, String jwtToken) {

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization",
                jwtToken.startsWith("Bearer ")
                        ? jwtToken
                        : "Bearer " + jwtToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        restTemplate.exchange(
                donationServiceUrl + "/donations/" + donationId + "/pickup",
                HttpMethod.PUT,
                request,
                Void.class
        );
    }

    public void deliverDonation(Long donationId, String jwtToken) {

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization",
                jwtToken.startsWith("Bearer ")
                        ? jwtToken
                        : "Bearer " + jwtToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        restTemplate.exchange(
                donationServiceUrl + "/donations/" + donationId + "/deliver",
                HttpMethod.PUT,
                request,
                Void.class
        );
    }

}

