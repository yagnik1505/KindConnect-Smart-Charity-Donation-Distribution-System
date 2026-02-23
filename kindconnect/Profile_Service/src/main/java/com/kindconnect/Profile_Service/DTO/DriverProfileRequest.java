package com.kindconnect.Profile_Service.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DriverProfileRequest {


    @NotBlank
    private String name;

    @NotBlank
    private String phone;

    @NotBlank
    private String vehicleType;

    @NotBlank
    private String vehicleNumber;

    @NotBlank
    private String licenseNumber;
}