package com.kindconnect.Ngo_Service.DTO;

import java.time.LocalDateTime;

public class NgoDonationViewDto {

    private Long donationId;
    private String donationStatus; // LIVE status from Donation Service
    private LocalDateTime acceptedAt;

    public NgoDonationViewDto(
            Long donationId,
            String donationStatus,
            LocalDateTime acceptedAt
    ) {
        this.donationId = donationId;
        this.donationStatus = donationStatus;
        this.acceptedAt = acceptedAt;
    }

    public Long getDonationId() {
        return donationId;
    }

    public String getDonationStatus() {
        return donationStatus;
    }

    public LocalDateTime getAcceptedAt() {
        return acceptedAt;
    }
}
