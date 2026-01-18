package com.kindconnect.Driver_Service.Controller;

import com.kindconnect.Driver_Service.DTO.AvailablePickupDto;
import com.kindconnect.Driver_Service.DTO.DriverDashboardDto;
import com.kindconnect.Driver_Service.Service.DriverDashboardService;
import com.kindconnect.Driver_Service.Service.DriverService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
}
