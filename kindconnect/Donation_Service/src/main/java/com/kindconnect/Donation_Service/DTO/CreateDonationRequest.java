package com.kindconnect.Donation_Service.DTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateDonationRequest {

    @NotBlank
    private String itemType;

    @Min(1)
    private int quantity;

    private String description;
}