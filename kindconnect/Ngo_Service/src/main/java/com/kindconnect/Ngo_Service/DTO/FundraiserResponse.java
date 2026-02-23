package com.kindconnect.Ngo_Service.DTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.kindconnect.Ngo_Service.Model.FundraiserCategory;
import com.kindconnect.Ngo_Service.Model.FundraiserStatus;

import lombok.Data;

@Data
public class FundraiserResponse {
    private Long id;
    private Long ngoUserId;
    private String ngoName;
    private String upiId;
    private String title;
    private String description;
    private String story;
    private FundraiserCategory category;
    private BigDecimal targetAmount;
    private BigDecimal currentAmount;
    private Integer percentageFunded;
    private String imageUrl;
    private List<String> additionalImages;
    private String videoUrl;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private FundraiserStatus status;
    private Integer totalDonors;
    private String beneficiaryName;
    private String beneficiaryLocation;
    private String urgencyLevel;
    private LocalDateTime createdAt;
    private Boolean featured;
    private Long daysLeft;
    private Boolean isActive;
}
