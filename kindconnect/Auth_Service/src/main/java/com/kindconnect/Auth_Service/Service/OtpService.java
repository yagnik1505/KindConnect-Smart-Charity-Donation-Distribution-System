package com.kindconnect.Auth_Service.Service;

import java.security.SecureRandom;
import java.time.Duration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.kindconnect.Auth_Service.Exception.InvalidOtpException;
import com.kindconnect.Auth_Service.Exception.OtpExpiredException;
import com.kindconnect.Auth_Service.Exception.OtpNotFoundException;
import com.kindconnect.Auth_Service.Exception.OtpNotVerifiedException;
import com.kindconnect.Auth_Service.Exception.UserAlreadyExistsException;
import com.kindconnect.Auth_Service.Repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class OtpService {

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final RedisTemplate<String, String> redisTemplate;

    @Value("${otp.expiration.minutes:5}")
    private long otpExpirationMinutes;

    @Value("${otp.length:6}")
    private int otpLength;

    public void requestOtp(String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new UserAlreadyExistsException("Email already registered");
        }

        String otpCode = generateOtp();
        log.info("Generated OTP for: {}", email);
        
        saveOtp(email, otpCode);
        
        emailService.sendOtpEmail(email, otpCode);
    }

    public void verifyOtp(String email, String otpCode) {
        String key = "otp:" + email;
        String storedOtp = redisTemplate.opsForValue().get(key);

        if (storedOtp == null) {
            log.warn("Failed OTP verification for {}: OTP expired or not found", email);
            throw new OtpExpiredException("OTP expired or not found");
        }

        if (!storedOtp.equals(otpCode)) {
            log.warn("Failed OTP verification for {}: Invalid OTP", email);
            throw new InvalidOtpException("Invalid OTP");
        }

        log.info("OTP verified successfully for: {}", email);
        
        // On success
        markVerified(email);
        removeOtp(email);
    }

    public void saveOtp(String email, String otpCode) {
        String key = "otp:" + email;
        redisTemplate.opsForValue().set(key, otpCode, Duration.ofMinutes(otpExpirationMinutes));
        log.info("Stored OTP in Redis: {}", key);
    }

    public void markVerified(String email) {
        String key = "verified:" + email;
        redisTemplate.opsForValue().set(key, "true", Duration.ofMinutes(10));
        log.info("Verification key created: {}", key);
    }

    public boolean isVerified(String email) {
        String key = "verified:" + email;
        String verified = redisTemplate.opsForValue().get(key);
        return "true".equals(verified);
    }

    public void removeOtp(String email) {
        String key = "otp:" + email;
        redisTemplate.delete(key);
        log.debug("OTP removed: {}", key);
    }

    public void removeVerification(String email) {
        String key = "verified:" + email;
        redisTemplate.delete(key);
        log.info("Verification key removed: {}", key);
    }

    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        int bound = (int) Math.pow(10, otpLength);
        int floor = (int) Math.pow(10, otpLength - 1);
        int number = floor + random.nextInt(bound - floor);
        return String.valueOf(number);
    }
}
