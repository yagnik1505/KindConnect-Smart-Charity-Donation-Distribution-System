package com.kindconnect.Ngo_Service.Controller;

import com.kindconnect.Ngo_Service.DTO.*;
import com.kindconnect.Ngo_Service.Service.NgoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ngo")
@RequiredArgsConstructor
public class NgoController {

    private final NgoService ngoService;

    private Long currentUserId() {
        return (Long) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
    }

    // ================= ACCEPT =================
    @PutMapping("/donations/{donationId}/accept")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<?> acceptDonation(
            @PathVariable Long donationId,
            @RequestHeader("Authorization") String token) {

        ngoService.acceptDonation(
                donationId,
                currentUserId(),
                token
        );

        return ResponseEntity.ok(
                Map.of("message", "Donation accepted successfully")
        );
    }

    // ================= MY DONATIONS =================
    @GetMapping("/donations/my")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<List<NgoDonationResponseDto>> myDonations() {
        return ResponseEntity.ok(
                ngoService.getMyDonations(currentUserId())
        );
    }

    // ================= CANCEL =================
    @PutMapping("/donations/{donationId}/cancel")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<?> cancelDonation(
            @PathVariable Long donationId,
            @RequestHeader("Authorization") String token) {

        ngoService.cancelDonation(
                donationId,
                currentUserId(),
                token
        );

        return ResponseEntity.ok(
                Map.of("message", "Donation cancelled successfully")
        );
    }

    // ================= DASHBOARD =================
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<NgoDashboardDto> dashboard() {
        return ResponseEntity.ok(
                ngoService.dashboard(currentUserId())
        );
    }
}
