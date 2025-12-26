package com.kindconnect.Donation_Service.Model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // from JWT (donor)
    private Long donorUserId;

    // assigned later (NGO)
    private Long ngoUserId;

    private String itemType;
    private int quantity;
    private String description;

    @Enumerated(EnumType.STRING)
    private DonationStatus status;

    private LocalDateTime createdAt;
}

