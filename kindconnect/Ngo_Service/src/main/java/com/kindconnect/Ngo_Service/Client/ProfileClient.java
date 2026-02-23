package com.kindconnect.Ngo_Service.Client;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class ProfileClient {

    private static final String BEARER_PREFIX = "Bearer ";
    private static final String AUTHORIZATION_HEADER = "Authorization";

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${profile.service.url:http://localhost:8082}")
    private String profileServiceUrl;

    @SuppressWarnings("unchecked")
    public Map<String, Object> getNgoProfileByUserId(Long userId, String jwtToken) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set(AUTHORIZATION_HEADER, 
                    jwtToken.startsWith(BEARER_PREFIX) ? jwtToken : BEARER_PREFIX + jwtToken);

            HttpEntity<Void> request = new HttpEntity<>(headers);

            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    profileServiceUrl + "/profiles/ngo/user/" + userId,
                    HttpMethod.GET,
                    request,
                    (Class<Map<String, Object>>) (Class<?>) Map.class
            );

            if (response.getBody() != null && response.getBody().get("data") != null) {
                return (Map<String, Object>) response.getBody().get("data");
            }
            return null;
        } catch (RuntimeException e) {
            // Profile not found or service unavailable
            return null;
        }
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> getDonorProfileByUserId(Long userId, String jwtToken) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set(AUTHORIZATION_HEADER, 
                    jwtToken.startsWith(BEARER_PREFIX) ? jwtToken : BEARER_PREFIX + jwtToken);

            HttpEntity<Void> request = new HttpEntity<>(headers);

            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    profileServiceUrl + "/profiles/donor/user/" + userId,
                    HttpMethod.GET,
                    request,
                    (Class<Map<String, Object>>) (Class<?>) Map.class
            );

            if (response.getBody() != null && response.getBody().get("data") != null) {
                return (Map<String, Object>) response.getBody().get("data");
            }
            return null;
        } catch (RuntimeException e) {
            // Profile not found or service unavailable
            return null;
        }
    }
}
