package com.kindconnect.Auth_Service.Controller;


import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kindconnect.Auth_Service.DTO.CompleteRegistrationRequest;
import com.kindconnect.Auth_Service.DTO.OtpRequest;
import com.kindconnect.Auth_Service.DTO.OtpVerifyRequest;
import com.kindconnect.Auth_Service.Service.OtpService;
import com.kindconnect.Auth_Service.Service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final OtpService otpService;

    @PostMapping("/register/request-otp")
    public ResponseEntity<?> requestOtp(@RequestBody @Valid OtpRequest request) {
        otpService.requestOtp(request.getEmail());
        return ResponseEntity.ok(Map.of("Message", "OTP sent successfully"));
    }

    @PostMapping("/register/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody @Valid OtpVerifyRequest request) {
        otpService.verifyOtp(request.getEmail(), request.getOtpCode());
        return ResponseEntity.ok(Map.of("Message", "OTP verified successfully"));
    }

    @PostMapping("/register/complete")
    public ResponseEntity<?> completeRegistration(@RequestBody @Valid CompleteRegistrationRequest request) {
        userService.completeRegistration(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of("Message", "User registered successfully"));
    }

}
