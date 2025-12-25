package com.kindconnect.Profile_Service.Controller;

import com.kindconnect.Profile_Service.DTO.*;

import com.kindconnect.Profile_Service.Service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/profiles")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    // DONOR PROFILE
    @PostMapping("/donor")
    public ResponseEntity<?> createDonorProfile(
            @RequestBody @Valid DonorProfileRequest request) {
        System.out.println("Inn");
        profileService.createDonorProfile(request);
        System.out.println("out");
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of("Message", "Donor profile created successfully"));
    }

    // NGO PROFILE
    @PostMapping("/ngo")
    public ResponseEntity<?> createNgoProfile(
            @RequestBody @Valid NgoProfileRequest request) {

        profileService.createNgoProfile(request);
        System.out.println("out");
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of("Message", "NGO profile created successfully"));
    }

    // DRIVER PROFILE
    @PostMapping("/driver")
    public ResponseEntity<?> createDriverProfile(
            @RequestBody @Valid DriverProfileRequest request) {
        System.out.println("innn");
        profileService.createDriverProfile(request);
        System.out.println("out");
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of("Message", "Driver profile created successfully"));
    }

    // GET DONOR PROFILE
    @GetMapping("/donor/{userId}")
    public ResponseEntity<?> getDonorProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(
                Map.of("data", profileService.getDonorProfile(userId))
        );
    }

    // GET NGO PROFILE
    @GetMapping("/ngo/{userId}")
    public ResponseEntity<?> getNgoProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(
                Map.of("data", profileService.getNgoProfile(userId))
        );
    }

    // GET DRIVER PROFILE
    @GetMapping("/driver/{userId}")
    public ResponseEntity<?> getDriverProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(
                Map.of("data", profileService.getDriverProfile(userId))
        );
    }
};
