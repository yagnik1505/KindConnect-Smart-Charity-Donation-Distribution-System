package com.kindconnect.Donation_Service.DTO;

import com.kindconnect.Donation_Service.Model.DonationStatus;
import lombok.Data;

@Data
public class DonationResponse {

    private Long id;
    private String itemType;
    private int quantity;
    private DonationStatus status;
}
