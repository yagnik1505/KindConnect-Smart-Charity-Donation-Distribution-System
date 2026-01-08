package com.kindconnect.Donation_Service.Controller;

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
            @Valid @RequestBody CreateDonationRequest request
    ) {

        Donation donation =
                donationService.createDonation(currentUserId(), request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                        "message", "Donation created successfully",
                        "donationId", donation.getId()
                ));
    }

    // ================= MY DONATIONS =================
    @GetMapping("/my")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<List<Donation>> getMyDonations() {
        return ResponseEntity.ok(
                donationService.getMyDonations(currentUserId())
        );
    }

    // ================= CANCEL =================
    @PutMapping("/{donationId}/cancel")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<?> cancelDonation(@PathVariable Long donationId) {

        donationService.cancelDonation(donationId, currentUserId());

        return ResponseEntity.ok(
                Map.of("message", "Donation cancelled", "donationId", donationId)
        );
    }

    // ================= GET BY ID =================
    @GetMapping("/{donationId}")
    @PreAuthorize("hasAnyRole('DONOR','NGO','DRIVER')")
    public ResponseEntity<Donation> getDonationById(
            @PathVariable Long donationId
    ) {
        return ResponseEntity.ok(
                donationService.getDonation(donationId)
        );
    }

    // ================= ACCEPT =================
    @PutMapping("/{donationId}/accept")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<?> acceptDonation(@PathVariable Long donationId) {

        donationService.acceptDonation(donationId, currentUserId());

        return ResponseEntity.ok(
                Map.of("message", "Donation accepted", "donationId", donationId)
        );
    }

    // ================= PICKUP =================
    @PutMapping("/{donationId}/pickup")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<?> pickupDonation(@PathVariable Long donationId) {

        donationService.pickupDonation(donationId, currentUserId());

        return ResponseEntity.ok(
                Map.of("message", "Donation picked up", "donationId", donationId)
        );
    }

    // ================= DELIVER =================
    @PutMapping("/{donationId}/deliver")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<?> markAsDelivered(@PathVariable Long donationId) {

        donationService.markAsDelivered(donationId, currentUserId());

        return ResponseEntity.ok(
                Map.of("message", "Donation delivered", "donationId", donationId)
        );
    }
}
