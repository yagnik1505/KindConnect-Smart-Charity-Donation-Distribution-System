package com.kindconnect.Auth_Service.Service;

import com.kindconnect.Auth_Service.Model.User;
import com.kindconnect.Auth_Service.Repository.UserRepository;
import com.kindconnect.Auth_Service.Security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    public String login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not Found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }


        // ✅ Enum handled correctly
        return jwtUtil.generateToken(
                user.getId(),
                user.getRole()
        );
    }
}
