package com.kindconnect.Ngo_Service.DTO;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class FundraiserDonationRequest {
    private BigDecimal amount;
    private String message;
    private Boolean anonymous;
    private String paymentId;
}
