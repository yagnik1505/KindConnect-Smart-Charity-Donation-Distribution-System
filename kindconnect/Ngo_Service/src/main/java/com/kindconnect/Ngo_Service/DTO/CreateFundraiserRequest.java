package com.kindconnect.Ngo_Service.DTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.kindconnect.Ngo_Service.Model.FundraiserCategory;

import lombok.Data;

@Data
public class CreateFundraiserRequest {
    private String title;
    private String description;
    private String story;
    private FundraiserCategory category;
    private BigDecimal targetAmount;
    private String imageUrl;
    private List<String> additionalImages;
    private String videoUrl;
    private LocalDateTime endDate;
    private String beneficiaryName;
    private String beneficiaryLocation;
    private String urgencyLevel;
    private String upiId; // Optional: NGO can override their default UPI ID
}
