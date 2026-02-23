package com.kindconnect.Ngo_Service.Model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "fundraiser_donations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FundraiserDonation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long fundraiserId;
    
    private Long donorUserId;
    
    private String donorName;

    @Column(precision = 15, scale = 2)
    private BigDecimal amount;

    private String message; // Optional message from donor

    private Boolean anonymous = false;

    private String paymentId; // Payment gateway reference

    private String paymentStatus; // PENDING, COMPLETED, FAILED

    private LocalDateTime donatedAt;

    @PrePersist
    protected void onCreate() {
        donatedAt = LocalDateTime.now();
        if (anonymous == null) {
            anonymous = false;
        }
    }
}
