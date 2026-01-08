package com.kindconnect.Profile_Service.Controller;

import com.kindconnect.Profile_Service.DTO.*;

import com.kindconnect.Profile_Service.Service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
@RestController
@RequestMapping("/profiles")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    private Long currentUserId() {
        return (Long) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
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
