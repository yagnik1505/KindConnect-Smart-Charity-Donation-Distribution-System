package com.kindconnect.Profile_Service.Controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kindconnect.Profile_Service.DTO.DonorProfileRequest;
import com.kindconnect.Profile_Service.DTO.DriverProfileRequest;
import com.kindconnect.Profile_Service.DTO.NgoProfileRequest;
import com.kindconnect.Profile_Service.Service.ProfileService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
@RestController
@RequestMapping("/profiles")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    private Long currentUserId() {
        try {
            Object principal = SecurityContextHolder
                    .getContext()
                    .getAuthentication()
                    .getPrincipal();
            
            if (principal instanceof Long) {
                return (Long) principal;
            } else if (principal instanceof String) {
                return Long.parseLong((String) principal);
            } else {
                throw new RuntimeException("Invalid principal type: " + principal.getClass().getName());
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to extract user ID from security context: " + e.getMessage(), e);
        }
    }

    // ================= DONOR =================
    @PostMapping("/donor")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<?> createDonorProfile(
            @Valid @RequestBody DonorProfileRequest request
    ) {
        profileService.createDonorProfile(currentUserId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Donor profile created successfully"));
    }

    @GetMapping("/donor/me")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<?> getDonorProfile() {
        return ResponseEntity.ok(
                Map.of("data", profileService.getDonorProfile(currentUserId()))
        );
    }

    // ================= NGO =================
    @PostMapping("/ngo")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<?> createNgoProfile(
            @Valid @RequestBody NgoProfileRequest request
    ) {
        profileService.createNgoProfile(currentUserId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "NGO profile created successfully"));
    }

    @GetMapping("/ngo/me")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<?> getNgoProfile() {
        return ResponseEntity.ok(
                Map.of("data", profileService.getNgoProfile(currentUserId()))
        );
    }
    
    // Get all approved NGOs (public endpoint for donors)
    @GetMapping("/ngo/all")
    public ResponseEntity<?> getAllApprovedNgos() {
        return ResponseEntity.ok(
                Map.of("data", profileService.getAllApprovedNgos())
        );
    }
    
    // Get all NGOs (for stats/browse - includes all statuses)
    @GetMapping("/ngo/list")
    public ResponseEntity<?> getAllNgos() {
        return ResponseEntity.ok(
                Map.of("data", profileService.getAllNgos())
        );
    }
    
    // Get NGOs by city
    @GetMapping("/ngo/city")
    public ResponseEntity<?> getNgosByCity(@RequestParam String city) {
        return ResponseEntity.ok(
                Map.of("data", profileService.getNgosByCity(city))
        );
    }

    // ================= DRIVER =================
    @PostMapping("/driver")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<?> createDriverProfile(
            @Valid @RequestBody DriverProfileRequest request
    ) {
        profileService.createDriverProfile(currentUserId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Driver profile created successfully"));
    }

    @GetMapping("/driver/me")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<?> getDriverProfile() {
        return ResponseEntity.ok(
                Map.of("data", profileService.getDriverProfile(currentUserId()))
        );
    }

    @PutMapping("/driver/availability")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<?> updateDriverAvailability(
            @RequestParam boolean available
    ) {
        profileService.updateDriverAvailability(currentUserId(), available);

        return ResponseEntity.ok(
                Map.of(
                        "message", "Driver availability updated successfully",
                        "available", available
                )
        );
    }
}
