package com.kindconnect.Donation_Service.Controller;

import java.util.List;
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
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kindconnect.Donation_Service.DTO.AvailableForDriverDto;
import com.kindconnect.Donation_Service.DTO.CreateDonationRequest;
import com.kindconnect.Donation_Service.DTO.DriverDeliveryDto;
import com.kindconnect.Donation_Service.Model.Donation;
import com.kindconnect.Donation_Service.Service.DonationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/donations")
@RequiredArgsConstructor
public class DonationController {

    private static final String MESSAGE_KEY = "message";
    private static final String DONATION_ID_KEY = "donationId";

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
                        MESSAGE_KEY, "Donation created successfully",
                        DONATION_ID_KEY, donation.getId()
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
                Map.of(MESSAGE_KEY, "Donation cancelled")
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
                MESSAGE_KEY, "Donation accepted by NGO",
                DONATION_ID_KEY, donationId
        ));
    }


    // ================= NGO CANCEL =================
    @PutMapping("/{donationId}/cancel-by-ngo")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<?> cancelByNgo(
            @PathVariable Long donationId) {

        donationService.cancelByNgo(donationId);

        return ResponseEntity.ok(
                Map.of(MESSAGE_KEY, "Donation cancelled by NGO")
        );
    }

    // ================= AVAILABLE =================
    @GetMapping("/available")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<List<Donation>> availableDonations() {
        return ResponseEntity.ok(
                donationService.getAvailableDonations(currentUserId())
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
                MESSAGE_KEY, "Donation picked up",
                DONATION_ID_KEY, donationId
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
                MESSAGE_KEY, "Donation delivered successfully",
                DONATION_ID_KEY, donationId
        ));
    }

    // Get driver's in-transit deliveries
    @GetMapping("/driver/in-transit")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<List<DriverDeliveryDto>> getDriverInTransitDeliveries(
            @RequestHeader("Authorization") String token
    ) {
        return ResponseEntity.ok(
                donationService.getDriverInTransitDeliveries(currentUserId(), token)
        );
    }

    // Get driver's completed deliveries
    @GetMapping("/driver/completed")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<List<DriverDeliveryDto>> getDriverCompletedDeliveries(
            @RequestHeader("Authorization") String token
    ) {
        return ResponseEntity.ok(
                donationService.getDriverCompletedDeliveries(currentUserId(), token)
        );
    }

}
