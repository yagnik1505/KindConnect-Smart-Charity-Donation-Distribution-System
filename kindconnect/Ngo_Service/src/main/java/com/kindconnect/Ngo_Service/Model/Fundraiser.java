package com.kindconnect.Ngo_Service.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "fundraisers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Fundraiser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long ngoUserId;
    
    private String ngoName;
    
    private String upiId; // UPI ID for direct donations

    @Column(nullable = false)
    private String title;

    @Column(length = 5000)
    private String description;

    @Column(length = 2000)
    private String story; // Detailed story about the cause

    @Enumerated(EnumType.STRING)
    private FundraiserCategory category;

    @Column(precision = 15, scale = 2)
    private BigDecimal targetAmount;

    @Column(precision = 15, scale = 2)
    private BigDecimal currentAmount = BigDecimal.ZERO;

    private String imageUrl; // Main image

    @ElementCollection
    @CollectionTable(name = "fundraiser_images", joinColumns = @JoinColumn(name = "fundraiser_id"))
    @Column(name = "image_url")
    private List<String> additionalImages = new ArrayList<>();

    private String videoUrl; // Optional video link

    private LocalDateTime startDate;
    
    private LocalDateTime endDate;

    @Enumerated(EnumType.STRING)
    private FundraiserStatus status = FundraiserStatus.ACTIVE;

    private Integer totalDonors = 0;

    private String beneficiaryName;
    
    private String beneficiaryLocation;

    private String urgencyLevel; // LOW, MEDIUM, HIGH, CRITICAL

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    private Boolean featured = false;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (currentAmount == null) {
            currentAmount = BigDecimal.ZERO;
        }
        if (totalDonors == null) {
            totalDonors = 0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Calculate percentage funded
    public int getPercentageFunded() {
        if (targetAmount == null || targetAmount.compareTo(BigDecimal.ZERO) == 0) {
            return 0;
        }
        return currentAmount.multiply(BigDecimal.valueOf(100))
                .divide(targetAmount, 0, java.math.RoundingMode.FLOOR)
                .intValue();
    }

    // Check if fundraiser is still active
    public boolean isActive() {
        return status == FundraiserStatus.ACTIVE && 
               (endDate == null || LocalDateTime.now().isBefore(endDate));
    }
}
