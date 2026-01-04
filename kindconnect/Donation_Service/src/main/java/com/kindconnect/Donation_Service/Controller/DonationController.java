package com.kindconnect.Donation_Service.Controller;

import com.kindconnect.Donation_Service.DTO.CreateDonationRequest;
import com.kindconnect.Donation_Service.Model.Donation;
import com.kindconnect.Donation_Service.Service.DonationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/donations")
@RequiredArgsConstructor
public class DonationController {

    private final DonationService donationService;

    // CREATE DONATION
    @PostMapping
    public ResponseEntity<?> createDonation(
            @RequestBody @Valid CreateDonationRequest request) {

        // TEMP – will be replaced by JWT
        Long donorUserId = 1L;

        Donation donation = donationService.createDonation(donorUserId, request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of(
                        "message", "Donation created successfully",
                        "donationId", donation.getId()
                ));
    }

    // GET MY DONATIONS
    @GetMapping("/my")
    public ResponseEntity<List<Donation>> getMyDonations() {

        Long donorUserId = 1L; // TEMP

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(donationService.getMyDonations(donorUserId));
    }

    // CANCEL DONATION
    @PutMapping("/{donationId}/cancel")
    public ResponseEntity<?> cancelDonation(@PathVariable Long donationId) {

        Long donorUserId = 1L; // TEMP – JWT later

        donationService.cancelDonation(donationId, donorUserId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(Map.of(
                        "message", "Donation cancelled successfully",
                        "donationId", donationId
                ));
    }

    // TRACK DONATION BY ID
    @GetMapping("/{donationId}")
    public ResponseEntity<Donation> getDonationById(
            @PathVariable Long donationId) {

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(donationService.getDonation(donationId));
    }

    @PutMapping("/{donationId}/accept")
    public ResponseEntity<?> acceptDonation(@PathVariable Long donationId) {

        Long ngoUserId = 10L; // TEMP (JWT later)

        donationService.acceptDonation(donationId, ngoUserId);

        return ResponseEntity.ok(
                Map.of("message", "Donation accepted", "donationId", donationId)
        );
    }

    @PutMapping("/{donationId}/pickup")
    public ResponseEntity<?> pickupDonation(@PathVariable Long donationId) {

        Long driverUserId = 20L; // TEMP

        donationService.pickupDonation(donationId, driverUserId);

        return ResponseEntity.ok(Map.of("message", "Donation picked up", "donationId", donationId));
    }

    @PutMapping("/{donationId}/deliver")
    public ResponseEntity<?> markAsDelivered(@PathVariable Long donationId) {

        Long driverUserId = 20L; // TEMP (JWT later)

        donationService.markAsDelivered(donationId, driverUserId);

        return ResponseEntity.ok(
                Map.of("message", "Donation delivered successfully",
                        "donationId", donationId)
        );
    }




}
