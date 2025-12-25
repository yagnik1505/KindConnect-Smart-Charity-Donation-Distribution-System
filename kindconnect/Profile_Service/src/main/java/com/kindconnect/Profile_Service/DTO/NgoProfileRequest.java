package com.kindconnect.Profile_Service.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class NgoProfileRequest {

    @NotNull
    private Long userId;

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
}
