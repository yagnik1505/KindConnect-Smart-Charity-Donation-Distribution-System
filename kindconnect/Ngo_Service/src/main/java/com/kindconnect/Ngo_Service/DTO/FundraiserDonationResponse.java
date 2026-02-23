package com.kindconnect.Ngo_Service.DTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class FundraiserDonationResponse {
    private Long id;
    private Long fundraiserId;
    private String fundraiserTitle;
    private Long donorUserId;
    private String donorName;
    private BigDecimal amount;
    private String message;
    private Boolean anonymous;
    private LocalDateTime donatedAt;
}
