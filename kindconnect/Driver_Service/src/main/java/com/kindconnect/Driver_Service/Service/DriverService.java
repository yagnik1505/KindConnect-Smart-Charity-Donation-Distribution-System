package com.kindconnect.Driver_Service.Service;

import com.kindconnect.Driver_Service.Model.DonationClient;
import com.kindconnect.Driver_Service.DTO.AvailablePickupDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DriverService {

    private final DonationClient donationClient;
    private final DriverDashboardService dashboardService;

    // ================= STAGE 3 =================
    // View available donations
    public List<AvailablePickupDto> getAvailablePickups(String jwtToken) {
        return donationClient.getAvailablePickups(jwtToken);
    }

    // ================= STAGE 4 =================
    // Pickup donation
    public void pickupDonation(
            Long donationId,
            Long driverUserId,
            String jwtToken
    ) {

        // 1️⃣ Call Donation Service (state change)
        donationClient.pickupDonation(donationId, jwtToken);

        // 2️⃣ Record action (Stage 6)
        dashboardService.recordPickup(driverUserId, donationId);
    }

    // ================= STAGE 5 =================
    // Deliver donation
    public void deliverDonation(
            Long donationId,
            Long driverUserId,
            String jwtToken
    ) {

        // 1️⃣ Call Donation Service (state change)
        donationClient.deliverDonation(donationId, jwtToken);

        // 2️⃣ Record action (Stage 6)
        dashboardService.recordDelivery(driverUserId, donationId);
    }
}
