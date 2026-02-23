package com.kindconnect.Auth_Service;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.kindconnect.Auth_Service.Model.Role;
import com.kindconnect.Auth_Service.Model.User;
import com.kindconnect.Auth_Service.Repository.UserRepository;

@SpringBootApplication
public class AuthServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AuthServiceApplication.class, args);
	}
	
	@Bean
	CommandLineRunner initAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			// Create or update hardcoded admin user
			String adminEmail = "admin@gmail.com";
			String adminPassword = "admin@123";
			
			User admin = userRepository.findByEmail(adminEmail)
					.orElse(new User());
			
			admin.setEmail(adminEmail);
			admin.setPassword(passwordEncoder.encode(adminPassword));
			admin.setRole(Role.ADMIN);
			
			userRepository.save(admin);
			System.out.println("========================================");
			System.out.println("✅ Admin user initialized successfully!");
			System.out.println("Email: " + adminEmail);
			System.out.println("Password: " + adminPassword);
			System.out.println("========================================");
		};
	}

}
