package com.kindconnect.Auth_Service.Util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Utility class to generate BCrypt password hashes
 * Run this main method to generate encrypted passwords for database storage
 */
public class PasswordHashGenerator {

    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // Generate hash for admin@123
        String password = "admin@123";
        String hashedPassword = encoder.encode(password);
        
        System.out.println("========================================");
        System.out.println("Password Hash Generator");
        System.out.println("========================================");
        System.out.println("Original Password: " + password);
        System.out.println("Encrypted Hash: " + hashedPassword);
        System.out.println("========================================");
        System.out.println("\nCopy the hash above and use it in your database.");
        System.out.println("Note: BCrypt generates different hashes each time (due to random salt)");
        System.out.println("All generated hashes are valid and will work for authentication.");
    }
}
