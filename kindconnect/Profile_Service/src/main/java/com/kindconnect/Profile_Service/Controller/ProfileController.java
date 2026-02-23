package com.kindconnect.Profile_Service.Controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    private static final String MESSAGE_KEY = "message";

    private final ProfileService profileService;

    private Long currentUserId() {
        try {
            Object principal = SecurityContextHolder
                    .getContext()
                    .getAuthentication()
                    .getPrincipal();
            
            if (principal instanceof Long userId) {
                return userId;
            } else if (principal instanceof String userIdStr) {
                return Long.parseLong(userIdStr);
            } else {
                throw new IllegalStateException("Invalid principal type: " + (principal != null ? principal.getClass().getName() : "null"));
            }
        } catch (NumberFormatException e) {
            throw new IllegalStateException("Failed to extract user ID from security context: " + e.getMessage(), e);
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
                .body(Map.of(MESSAGE_KEY, "Donor profile created successfully"));
    }

    @GetMapping("/donor/me")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<?> getDonorProfile() {
        return ResponseEntity.ok(
                Map.of("data", profileService.getDonorProfile(currentUserId()))
        );
    }

    @PutMapping("/donor/me")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<?> updateDonorProfile(
            @Valid @RequestBody DonorProfileRequest request
    ) {
        return ResponseEntity.ok(
                Map.of("data", profileService.updateDonorProfile(currentUserId(), request))
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
                .body(Map.of(MESSAGE_KEY, "NGO profile created successfully"));
    }

    @GetMapping("/ngo/me")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<?> getNgoProfile() {
        return ResponseEntity.ok(
                Map.of("data", profileService.getNgoProfile(currentUserId()))
        );
    }

    @PutMapping("/ngo/me")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<?> updateNgoProfile(
            @Valid @RequestBody NgoProfileRequest request
    ) {
        return ResponseEntity.ok(
                Map.of("data", profileService.updateNgoProfile(currentUserId(), request))
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
    
    // Get NGO by profile ID (for detail page)
    @GetMapping("/ngo/{id}")
    public ResponseEntity<?> getNgoById(@PathVariable Long id) {
        return ResponseEntity.ok(
                Map.of("data", profileService.getNgoById(id))
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
                .body(Map.of(MESSAGE_KEY, "Driver profile created successfully"));
    }

    @GetMapping("/driver/me")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<?> getDriverProfile() {
        return ResponseEntity.ok(
                Map.of("data", profileService.getDriverProfile(currentUserId()))
        );
    }

    @PutMapping("/driver/me")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<?> updateDriverProfile(
            @Valid @RequestBody DriverProfileRequest request
    ) {
        return ResponseEntity.ok(
                Map.of("data", profileService.updateDriverProfile(currentUserId(), request))
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
                        MESSAGE_KEY, "Driver availability updated successfully",
                        "available", available
                )
        );
    }

    // ================= INTER-SERVICE ENDPOINTS =================
    // Get NGO profile by userId (for other services)
    @GetMapping("/ngo/user/{userId}")
    public ResponseEntity<?> getNgoProfileByUserId(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(
                    Map.of("data", profileService.getNgoProfile(userId))
            );
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Get Donor profile by userId (for other services)
    @GetMapping("/donor/user/{userId}")
    public ResponseEntity<?> getDonorProfileByUserId(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(
                    Map.of("data", profileService.getDonorProfile(userId))
            );
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Get Driver profile by userId (for other services)
    @GetMapping("/driver/user/{userId}")
    public ResponseEntity<?> getDriverProfileByUserId(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(
                    Map.of("data", profileService.getDriverProfile(userId))
            );
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ================= ADMIN ENDPOINTS =================
    // Get all NGOs including pending/rejected
    @GetMapping("/ngos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllNgosForAdmin() {
        return ResponseEntity.ok(profileService.getAllNgosIncludingPending());
    }
    
    // Update NGO status (approve/reject)
    @PutMapping("/ngo/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateNgoStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request
    ) {
        try {
            String status = request.get("status");
            if (status == null || status.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Status is required"));
            }
            
            profileService.updateNgoStatus(id, status);
            return ResponseEntity.ok(
                    Map.of(MESSAGE_KEY, "NGO status updated successfully")
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    // Update NGO rating
    @PutMapping("/ngo/{id}/rating")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateNgoRating(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> request
    ) {
        try {
            Integer rating = request.get("rating");
            if (rating == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Rating is required"));
            }
            
            profileService.updateNgoRating(id, rating);
            return ResponseEntity.ok(
                    Map.of(MESSAGE_KEY, "NGO rating updated successfully")
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
