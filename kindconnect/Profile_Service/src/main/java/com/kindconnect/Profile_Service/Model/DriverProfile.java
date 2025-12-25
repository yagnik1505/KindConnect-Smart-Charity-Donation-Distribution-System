package com.kindconnect.Profile_Service.Model;

import jakarta.persistence.*;
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

    private Boolean available;
}
