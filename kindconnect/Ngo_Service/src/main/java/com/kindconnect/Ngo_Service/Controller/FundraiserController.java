package com.kindconnect.Ngo_Service.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kindconnect.Ngo_Service.DTO.CreateFundraiserRequest;
import com.kindconnect.Ngo_Service.DTO.FundraiserDonationRequest;
import com.kindconnect.Ngo_Service.DTO.FundraiserDonationResponse;
import com.kindconnect.Ngo_Service.DTO.FundraiserResponse;
import com.kindconnect.Ngo_Service.DTO.ImpactStatsResponse;
import com.kindconnect.Ngo_Service.Model.FundraiserCategory;
import com.kindconnect.Ngo_Service.Service.FundraiserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/ngo/fundraisers")
@RequiredArgsConstructor
public class FundraiserController {

    private final FundraiserService fundraiserService;

    // Helper method to get current user ID from JWT token
    private Long currentUserId() {
        return (Long) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
    }

    // ============ NGO ENDPOINTS ============

    // Create fundraiser (NGO only)
    @PostMapping("/create")
    public ResponseEntity<FundraiserResponse> createFundraiser(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody CreateFundraiserRequest request) {
        String jwtToken = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
        return ResponseEntity.ok(fundraiserService.createFundraiser(currentUserId(), jwtToken, request));
    }

    // Get NGO's fundraisers
    @GetMapping("/my-fundraisers")
    public ResponseEntity<List<FundraiserResponse>> getMyFundraisers() {
        return ResponseEntity.ok(fundraiserService.getNgoFundraisers(currentUserId()));
    }

    // Update fundraiser (NGO only)
    @PutMapping("/{id}")
    public ResponseEntity<FundraiserResponse> updateFundraiser(
            @PathVariable Long id,
            @RequestBody CreateFundraiserRequest request) {
        return ResponseEntity.ok(fundraiserService.updateFundraiser(id, currentUserId(), request));
    }

    // Toggle fundraiser status (pause/resume)
    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<FundraiserResponse> toggleStatus(@PathVariable Long id) {
        return ResponseEntity.ok(fundraiserService.toggleFundraiserStatus(id, currentUserId()));
    }

    // ============ PUBLIC ENDPOINTS ============

    // Get all active fundraisers
    @GetMapping("/active")
    public ResponseEntity<List<FundraiserResponse>> getActiveFundraisers() {
        return ResponseEntity.ok(fundraiserService.getActiveFundraisers());
    }

    // Get fundraiser by ID
    @GetMapping("/{id}")
    public ResponseEntity<FundraiserResponse> getFundraiser(@PathVariable Long id) {
        return ResponseEntity.ok(fundraiserService.getFundraiserById(id));
    }

    // Get fundraisers by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<FundraiserResponse>> getByCategory(@PathVariable FundraiserCategory category) {
        return ResponseEntity.ok(fundraiserService.getFundraisersByCategory(category));
    }

    // Get featured fundraisers
    @GetMapping("/featured")
    public ResponseEntity<List<FundraiserResponse>> getFeatured() {
        return ResponseEntity.ok(fundraiserService.getFeaturedFundraisers());
    }

    // Get urgent fundraisers
    @GetMapping("/urgent")
    public ResponseEntity<List<FundraiserResponse>> getUrgent() {
        return ResponseEntity.ok(fundraiserService.getUrgentFundraisers());
    }

    // Search fundraisers
    @GetMapping("/search")
    public ResponseEntity<List<FundraiserResponse>> search(@RequestParam String query) {
        return ResponseEntity.ok(fundraiserService.searchFundraisers(query));
    }

    // ============ DONATION ENDPOINTS ============

    // Donate to a fundraiser
    @PostMapping("/{id}/donate")
    public ResponseEntity<FundraiserDonationResponse> donate(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody FundraiserDonationRequest request) {
        String jwtToken = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
        return ResponseEntity.ok(fundraiserService.donateToFundraiser(id, currentUserId(), jwtToken, request));
    }

    // Get donations for a fundraiser
    @GetMapping("/{id}/donations")
    public ResponseEntity<List<FundraiserDonationResponse>> getFundraiserDonations(@PathVariable Long id) {
        return ResponseEntity.ok(fundraiserService.getFundraiserDonations(id));
    }

    // Get recent donations for a fundraiser (public view)
    @GetMapping("/{id}/recent-donations")
    public ResponseEntity<List<FundraiserDonationResponse>> getRecentDonations(@PathVariable Long id) {
        return ResponseEntity.ok(fundraiserService.getRecentDonations(id));
    }

    // Get donor's donation history
    @GetMapping("/my-donations")
    public ResponseEntity<List<FundraiserDonationResponse>> getMyDonations() {
        return ResponseEntity.ok(fundraiserService.getDonorDonations(currentUserId()));
    }

    // Get all categories
    @GetMapping("/categories")
    public ResponseEntity<FundraiserCategory[]> getCategories() {
        return ResponseEntity.ok(FundraiserCategory.values());
    }
    
    // ============ IMPACT STATISTICS ============
    
    // Get donor's impact statistics
    @GetMapping("/impact-stats")
    public ResponseEntity<ImpactStatsResponse> getImpactStats() {
        return ResponseEntity.ok(fundraiserService.getDonorImpactStats(currentUserId()));
    }
}
