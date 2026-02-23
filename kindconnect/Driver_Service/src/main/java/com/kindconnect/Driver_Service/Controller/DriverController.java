package com.kindconnect.Driver_Service.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kindconnect.Driver_Service.DTO.AvailablePickupDto;
import com.kindconnect.Driver_Service.DTO.DriverDashboardDto;
import com.kindconnect.Driver_Service.DTO.DriverDeliveryDto;
import com.kindconnect.Driver_Service.Service.DriverDashboardService;
import com.kindconnect.Driver_Service.Service.DriverService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/driver")
public class DriverController {

    private final DriverService driverService;
    private final DriverDashboardService dashboardService;

    private Long currentDriverId() {
        return (Long) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
    }

    // ================= STAGE 3 =================
    // View available pickups
    @GetMapping("/donations/available")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<List<AvailablePickupDto>> availablePickups(
            @RequestHeader("Authorization") String token
    ) {
        return ResponseEntity.ok(
                driverService.getAvailablePickups(token)
        );
    }

    // ================= STAGE 4 =================
    // Pickup donation
    @PutMapping("/donations/{donationId}/pickup")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<?> pickupDonation(
            @PathVariable Long donationId,
            @RequestHeader("Authorization") String token
    ) {
        driverService.pickupDonation(
                donationId,
                currentDriverId(),
                token
        );

        return ResponseEntity.ok(
                Map.of("message", "Pickup confirmed")
        );
    }

    // ================= STAGE 5 =================
    // ✅ DELIVER donation (THIS WAS MISSING)
    @PutMapping("/donations/{donationId}/deliver")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<?> deliverDonation(
            @PathVariable Long donationId,
            @RequestHeader("Authorization") String token
    ) {
        driverService.deliverDonation(
                donationId,
                currentDriverId(),
                token
        );

        return ResponseEntity.ok(
                Map.of("message", "Donation delivered")
        );
    }

    // ================= STAGE 6 =================
    // Driver dashboard
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('DRIVER')")
    public DriverDashboardDto dashboard() {
        return dashboardService.getDashboard(
                currentDriverId()
        );
    }

    // ================= DRIVER DELIVERIES =================
    // Get driver's in-transit deliveries
    @GetMapping("/deliveries/in-transit")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<List<DriverDeliveryDto>> getInTransitDeliveries(
            @RequestHeader("Authorization") String token
    ) {
        return ResponseEntity.ok(
                driverService.getInTransitDeliveries(token)
        );
    }

    // Get driver's completed deliveries
    @GetMapping("/deliveries/completed")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<List<DriverDeliveryDto>> getCompletedDeliveries(
            @RequestHeader("Authorization") String token
    ) {
        return ResponseEntity.ok(
                driverService.getCompletedDeliveries(token)
        );
    }
}
