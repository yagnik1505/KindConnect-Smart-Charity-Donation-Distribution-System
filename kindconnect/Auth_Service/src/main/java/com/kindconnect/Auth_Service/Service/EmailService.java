package com.kindconnect.Auth_Service.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${otp.expiration.minutes:5}")
    private long otpExpirationMinutes;

    public void sendOtpEmail(String email, String otpCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("KindConnect Email Verification OTP");
        message.setText(
                "Your OTP is: " + otpCode + "\n" +
                        "This OTP expires in " + otpExpirationMinutes + " minutes."
        );

        try {
            mailSender.send(message);
            System.out.println("Successfully sent OTP email to " + email);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + email + " via SMTP: " + e.getMessage());
            System.out.println("\n==================================================");
            System.out.println("FALLBACK OTP CODE FOR " + email + ": " + otpCode);
            System.out.println("==================================================\n");
        }
    }
}
