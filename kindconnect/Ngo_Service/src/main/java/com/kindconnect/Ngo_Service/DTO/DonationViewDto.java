package com.kindconnect.Ngo_Service.DTO;

import lombok.Data;

@Data
public class DonationViewDto {

    private Long donationId;
    private Long donorUserId;
    private String itemType;
    private Integer quantity;
    private String description;
    private String status;
}
