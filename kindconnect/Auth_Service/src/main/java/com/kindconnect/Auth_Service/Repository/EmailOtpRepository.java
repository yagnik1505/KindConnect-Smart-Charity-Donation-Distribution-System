package com.kindconnect.Auth_Service.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kindconnect.Auth_Service.Model.EmailOtp;

public interface EmailOtpRepository extends JpaRepository<EmailOtp, Long> {
    Optional<EmailOtp> findTopByEmailOrderByCreatedAtDesc(String email);

    Optional<EmailOtp> findTopByOtpCodeOrderByCreatedAtDesc(String otpCode);

    Optional<EmailOtp> findByEmailAndOtpCodeAndUsedFalse(String email, String otpCode);

    void deleteByEmail(String email);
}
