package com.kindconnect.Profile_Service.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class NgoProfileRequest {


    @NotBlank
    private String ngoName;

    @NotBlank
    private String contactperson;

    @NotBlank
    private String phone;

    @NotBlank
    private String address;

    @NotBlank
    private String city;
    
    private String fieldType;  // Education, Healthcare, Environment, Food, Animal, Shelter
    private String description;
    private String logo;  // Base64 encoded image

    // Payment information (optional)
    private String upiId;
    private String bankAccountNumber;
    private String ifscCode;
    private String bankName;
}
