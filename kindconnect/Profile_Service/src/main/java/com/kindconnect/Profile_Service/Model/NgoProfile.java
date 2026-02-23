package com.kindconnect.Profile_Service.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import lombok.Data;

@Data
@Entity
public class NgoProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String ngoName;
    private String contactPerson;
    private String phone;
    private String address;
    private String city;
    
    // Field category (Education, Healthcare, Environment, Food, Animal, Shelter)
    private String fieldType;
    
    @Column(columnDefinition = "TEXT")
    private String description;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String logo;  // Base64 encoded profile picture

    // Payment information for direct donations
    private String upiId;
    private String bankAccountNumber;
    private String ifscCode;
    private String bankName;

    @Enumerated(EnumType.STRING)
    private NgoStatus status;
    
    // Admin rating (1-5 stars)
    private Integer rating;
    
    // Statistics (populated dynamically, not stored in DB)
    private transient Integer donationsCount;
    private transient Integer beneficiaries;
    private transient Long totalDonationsReceived;
    private transient String responseTime;
}
