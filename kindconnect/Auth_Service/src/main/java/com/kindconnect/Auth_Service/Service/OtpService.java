package com.kindconnect.Auth_Service.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kindconnect.Auth_Service.Exception.InvalidOtpException;
import com.kindconnect.Auth_Service.Exception.OtpExpiredException;
import com.kindconnect.Auth_Service.Exception.OtpNotFoundException;
import com.kindconnect.Auth_Service.Exception.OtpNotVerifiedException;
import com.kindconnect.Auth_Service.Exception.UserAlreadyExistsException;
import com.kindconnect.Auth_Service.Model.EmailOtp;
import com.kindconnect.Auth_Service.Repository.EmailOtpRepository;
import com.kindconnect.Auth_Service.Repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final EmailOtpRepository emailOtpRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Value("${otp.expiration.minutes:5}")
    private long otpExpirationMinutes;

    @Value("${otp.length:6}")
    private int otpLength;

    @Transactional
    public void requestOtp(String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new UserAlreadyExistsException("Email already registered");
        }

        emailOtpRepository.deleteByEmail(email);

        String otpCode = generateOtp();
        Instant now = Instant.now();

        EmailOtp otp = new EmailOtp();
        otp.setEmail(email);
        otp.setOtpCode(otpCode);
        otp.setExpiresAt(now.plus(otpExpirationMinutes, ChronoUnit.MINUTES));
        otp.setCreatedAt(now);
        otp.setUsed(false);

        emailOtpRepository.save(otp);
        emailService.sendOtpEmail(email, otpCode);
    }

    @Transactional
    public void verifyOtp(String email, String otpCode) {
        EmailOtp otp = emailOtpRepository.findByEmailAndOtpCodeAndUsedFalse(email, otpCode)
                .orElseThrow(() -> new InvalidOtpException("Invalid OTP"));

        if (otp.getExpiresAt().isBefore(Instant.now())) {
            throw new OtpExpiredException("OTP expired");
        }

        otp.setUsed(true);
        emailOtpRepository.save(otp);
    }

    public void assertOtpVerified(String email) {
        EmailOtp otp = emailOtpRepository.findTopByEmailOrderByCreatedAtDesc(email)
                .orElseThrow(() -> new OtpNotFoundException("OTP not requested"));

        if (!otp.isUsed()) {
            throw new OtpNotVerifiedException("OTP not verified");
        }

        if (otp.getExpiresAt().isBefore(Instant.now())) {
            throw new OtpExpiredException("OTP expired");
        }
    }

    public String getEmailFromVerifiedOtp(String otpCode) {
        EmailOtp otp = emailOtpRepository.findTopByOtpCodeOrderByCreatedAtDesc(otpCode)
                .orElseThrow(() -> new OtpNotFoundException("OTP not found or already used"));

        if (!otp.isUsed()) {
            throw new OtpNotVerifiedException("OTP not verified");
        }
        if (otp.getExpiresAt().isBefore(Instant.now())) {
            throw new OtpExpiredException("OTP has expired");
        }
        return otp.getEmail();
    }

    @Transactional
    public void clearOtps(String email) {
        emailOtpRepository.deleteByEmail(email);
    }

    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        int bound = (int) Math.pow(10, otpLength);
        int floor = (int) Math.pow(10, otpLength - 1);
        int number = floor + random.nextInt(bound - floor);
        return String.valueOf(number);
    }
}
