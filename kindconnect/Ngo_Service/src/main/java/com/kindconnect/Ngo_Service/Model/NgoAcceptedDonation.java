package com.kindconnect.Ngo_Service.Model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "ngo_donations")
@Data
public class NgoAcceptedDonation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long donationId;
    private Long ngoUserId;

    @Enumerated(EnumType.STRING)
    private NgoDonationStatus status;

    private LocalDateTime acceptedAt;
}

