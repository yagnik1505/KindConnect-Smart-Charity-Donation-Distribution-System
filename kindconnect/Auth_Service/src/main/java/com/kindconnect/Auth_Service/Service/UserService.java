package com.kindconnect.Auth_Service.Service;

import com.kindconnect.Auth_Service.DTO.LoginRequest;
import com.kindconnect.Auth_Service.DTO.RegisterRequest;
import com.kindconnect.Auth_Service.Exception.InvalidCredentialsException;
import com.kindconnect.Auth_Service.Exception.*;
import com.kindconnect.Auth_Service.Model.Role;
import com.kindconnect.Auth_Service.Model.User;
import com.kindconnect.Auth_Service.Repository.UserRepository;
import com.kindconnect.Auth_Service.Security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public void register(RegisterRequest request) {
        Role role = request.getRole();



        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("Email already registered");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);

        userRepository.save(user);
    }

}
