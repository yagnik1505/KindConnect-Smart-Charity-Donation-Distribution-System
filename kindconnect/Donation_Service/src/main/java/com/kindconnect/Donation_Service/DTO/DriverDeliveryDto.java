package com.kindconnect.Donation_Service.DTO;

import java.time.LocalDateTime;

import com.kindconnect.Donation_Service.Model.DonationStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DriverDeliveryDto {
    private Long donationId;
    private String itemType;
    private int quantity;
    private String description;
    private DonationStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime pickedUpAt;
    private LocalDateTime deliveredAt;
    private Long donorUserId;
    private Long ngoUserId;
    
    // NGO Details (to be populated via profile lookup)
    private String ngoName;
    private String ngoAddress;
    private String ngoCity;
    private String ngoPhone;
    
    // Donor Details
    private String donorName;
    private String donorAddress;
    private String donorCity;
    private String donorPhone;
}
