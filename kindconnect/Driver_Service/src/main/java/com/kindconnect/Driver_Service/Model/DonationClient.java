package com.kindconnect.Driver_Service.Model;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.kindconnect.Driver_Service.DTO.AvailablePickupDto;
import com.kindconnect.Driver_Service.DTO.DriverDeliveryDto;

@Component
public class DonationClient {

    private static final String BEARER_PREFIX = "Bearer ";
    private static final String AUTHORIZATION_HEADER = "Authorization";

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${donation.service.url}")
    private String donationServiceUrl;

    private void setAuthHeader(HttpHeaders headers, String jwtToken) {
        headers.set(AUTHORIZATION_HEADER,
                jwtToken.startsWith(BEARER_PREFIX) ? jwtToken : BEARER_PREFIX + jwtToken);
    }

    public List<AvailablePickupDto> getAvailablePickups(String jwtToken) {

        HttpHeaders headers = new HttpHeaders();
        setAuthHeader(headers, jwtToken);

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
        setAuthHeader(headers, jwtToken);

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
        setAuthHeader(headers, jwtToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        restTemplate.exchange(
                donationServiceUrl + "/donations/" + donationId + "/deliver",
                HttpMethod.PUT,
                request,
                Void.class
        );
    }

    // Get driver's in-transit deliveries
    public List<DriverDeliveryDto> getInTransitDeliveries(String jwtToken) {
        HttpHeaders headers = new HttpHeaders();
        setAuthHeader(headers, jwtToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<DriverDeliveryDto[]> response =
                restTemplate.exchange(
                        donationServiceUrl + "/donations/driver/in-transit",
                        HttpMethod.GET,
                        request,
                        DriverDeliveryDto[].class
                );

        return response.getBody() != null ? List.of(response.getBody()) : List.of();
    }

    // Get driver's completed deliveries
    public List<DriverDeliveryDto> getCompletedDeliveries(String jwtToken) {
        HttpHeaders headers = new HttpHeaders();
        setAuthHeader(headers, jwtToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<DriverDeliveryDto[]> response =
                restTemplate.exchange(
                        donationServiceUrl + "/donations/driver/completed",
                        HttpMethod.GET,
                        request,
                        DriverDeliveryDto[].class
                );

        return response.getBody() != null ? List.of(response.getBody()) : List.of();
    }

}

