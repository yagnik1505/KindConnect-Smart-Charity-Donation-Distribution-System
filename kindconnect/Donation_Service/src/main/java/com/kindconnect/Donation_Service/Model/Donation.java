package com.kindconnect.Donation_Service.Model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // from JWT (donor)
    private Long donorUserId;

    // OPTIONAL: if donor donates to a specific NGO (from Browse NGOs page)
    // This donation will ONLY be visible to this NGO
    // If null, donation is visible to ALL NGOs (general donation)
    private Long targetNgoUserId;

    // assigned later (NGO who accepts the donation)
    private Long ngoUserId;

    // assigned when DRIVER picks up
    private Long driverUserId;

    private String itemType;
    private int quantity;
    private String description;

    @Enumerated(EnumType.STRING)
    private DonationStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime pickedUpAt;
    private LocalDateTime deliveredAt;
}

