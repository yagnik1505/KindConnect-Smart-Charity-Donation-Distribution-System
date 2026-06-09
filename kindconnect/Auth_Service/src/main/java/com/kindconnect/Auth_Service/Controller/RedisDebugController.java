package com.kindconnect.Auth_Service.Controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/redis")
@RequiredArgsConstructor
public class RedisDebugController {

    private final RedisTemplate<String, String> redisTemplate;

    @GetMapping("/debug/{email}")
    public Map<String, Object> getRedisState(@PathVariable String email) {
        Map<String, Object> response = new HashMap<>();
        
        String otpKey = "otp:" + email;
        String verifiedKey = "verified:" + email;

        String otp = redisTemplate.opsForValue().get(otpKey);
        String verified = redisTemplate.opsForValue().get(verifiedKey);
        Long ttl = redisTemplate.getExpire(otpKey);
        
        // If otpKey is not found, check TTL of verifiedKey
        if (ttl == null || ttl <= 0) {
            ttl = redisTemplate.getExpire(verifiedKey);
        }

        response.put("otp", otp);
        response.put("verified", verified);
        response.put("ttl", ttl);

        return response;
    }
}
