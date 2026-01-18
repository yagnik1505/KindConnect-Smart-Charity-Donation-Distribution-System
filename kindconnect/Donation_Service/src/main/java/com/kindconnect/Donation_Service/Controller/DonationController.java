package com.kindconnect.Donation_Service.Controller;

import com.kindconnect.Donation_Service.DTO.AvailableForDriverDto;
import com.kindconnect.Donation_Service.DTO.CreateDonationRequest;
import com.kindconnect.Donation_Service.Model.Donation;
import com.kindconnect.Donation_Service.Service.DonationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/donations")
@RequiredArgsConstructor
public class DonationController {

    private final DonationService donationService;

    private Long currentUserId() {
        return (Long) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
    }

    // ================= CREATE =================
    @PostMapping
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<?> createDonation(
            @Valid @RequestBody CreateDonationRequest request) {

        Donation donation =
                donationService.createDonation(currentUserId(), request);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of(
                        "message", "Donation created successfully",
                        "donationId", donation.getId()
                )
        );
    }

    // ================= MY DONATIONS =================
    @GetMapping("/my")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<List<Donation>> getMyDonations() {
        return ResponseEntity.ok(
                donationService.getMyDonations(currentUserId())
        );
    }

    // ================= DONOR CANCEL =================
    @PutMapping("/{donationId}/cancel")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<?> cancelDonation(
            @PathVariable Long donationId) {

        donationService.cancelDonation(donationId, currentUserId());

        return ResponseEntity.ok(
                Map.of("message", "Donation cancelled")
        );
    }

    // ================= GET BY ID =================
    @GetMapping("/{donationId}")
    @PreAuthorize("hasAnyRole('DONOR','NGO','DRIVER')")
    public ResponseEntity<Donation> getDonation(
            @PathVariable Long donationId) {

        return ResponseEntity.ok(
                donationService.getDonation(donationId)
        );
    }

    // ================= NGO ACCEPT =================
    @PutMapping("/{donationId}/accept")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<?> acceptDonation(@PathVariable Long donationId) {
        donationService.acceptDonation(donationId, currentUserId());
        return ResponseEntity.ok(Map.of(
                "message", "Donation accepted by NGO",
                "donationId", donationId
        ));
    }


    // ================= NGO CANCEL =================
    @PutMapping("/{donationId}/cancel-by-ngo")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<?> cancelByNgo(
            @PathVariable Long donationId) {

        donationService.cancelByNgo(donationId);

        return ResponseEntity.ok(
                Map.of("message", "Donation cancelled by NGO")
        );
    }

    // ================= AVAILABLE =================
    @GetMapping("/available")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<List<Donation>> availableDonations() {
        return ResponseEntity.ok(
                donationService.getAvailableDonations()
        );
    }

    // Driver Availibility

    @GetMapping("/available-for-driver")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<List<AvailableForDriverDto>> availableForDriver() {
        return ResponseEntity.ok(donationService.getAvailableForDriver());
    }

    @PutMapping("/{donationId}/pickup")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<?> pickupDonation(@PathVariable Long donationId) {
        donationService.pickupDonation(donationId, currentUserId());
        return ResponseEntity.ok(Map.of(
                "message", "Donation picked up",
                "donationId", donationId
        ));
    }

    @PutMapping("/{donationId}/deliver")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<?> deliverDonation(@PathVariable Long donationId) {

        Long driverUserId =
                (Long) SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getPrincipal();

        donationService.markAsDelivered(donationId, driverUserId);

        return ResponseEntity.ok(Map.of(
                "message", "Donation delivered successfully",
                "donationId", donationId
        ));
    }

}
