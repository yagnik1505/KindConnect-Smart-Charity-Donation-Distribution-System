package com.kindconnect.Profile_Service.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DonorProfileRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String phone;

    @NotBlank
    private String address;

    @NotBlank
    private String city;

}
