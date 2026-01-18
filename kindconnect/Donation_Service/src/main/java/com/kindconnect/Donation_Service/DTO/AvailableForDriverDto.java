package com.kindconnect.Donation_Service.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AvailableForDriverDto {
    private Long donationId;
    private String itemType;
}
