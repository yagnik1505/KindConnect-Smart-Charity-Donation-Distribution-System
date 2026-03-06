package com.kindconnect.Profile_Service.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import lombok.Data;

@Data
@Entity
public class DriverProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String name;
    private String phone;
    private String vehicleType;
    private String vehicleNumber;
    private String licenseNumber;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String logo;  // Base64 encoded profile picture

    private Boolean available;

    private Integer rating;  // Admin-assigned rating (1-5)
}
