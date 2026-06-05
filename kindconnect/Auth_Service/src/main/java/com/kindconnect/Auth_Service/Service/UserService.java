package com.kindconnect.Auth_Service.Service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kindconnect.Auth_Service.DTO.CompleteRegistrationRequest;
import com.kindconnect.Auth_Service.Exception.UserAlreadyExistsException;
import com.kindconnect.Auth_Service.Model.User;
import com.kindconnect.Auth_Service.Repository.UserRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;

    @Transactional
    public void completeRegistration(CompleteRegistrationRequest request) {
        
        String email = otpService.getEmailFromVerifiedOtp(request.getOtpCode());

        if (userRepository.findByEmail(email).isPresent()) {
            throw new UserAlreadyExistsException("Email already registered");
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        userRepository.save(user);
        otpService.clearOtps(email);
    }

}
