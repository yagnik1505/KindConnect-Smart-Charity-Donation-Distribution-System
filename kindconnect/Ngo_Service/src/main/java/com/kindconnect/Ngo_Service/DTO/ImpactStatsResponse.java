package com.kindconnect.Ngo_Service.DTO;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImpactStatsResponse {
    
    // Overall Statistics
    private Integer totalDonations;
    private BigDecimal totalAmountDonated;
    private Integer fundraisersSupported;
    private Integer consecutiveDonationStreak;
    
    // Rankings & Achievements
    private Integer cityRank;
    private Integer overallRank;
    private List<AchievementBadge> badges;
    
    // Monthly breakdown
    private List<MonthlyDonation> monthlyDonations;
    
    // Category breakdown
    private Map<String, CategoryImpact> categoryBreakdown;
    
    // Recent impact
    private List<RecentImpact> recentImpacts;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AchievementBadge {
        private String id;
        private String name;
        private String description;
        private String icon;
        private String color;
        private String unlockedAt;
        private Integer progress;
        private Integer target;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyDonation {
        private String month;
        private Integer count;
        private BigDecimal amount;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryImpact {
        private String category;
        private Integer donationCount;
        private BigDecimal totalAmount;
        private Double percentage;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentImpact {
        private Long fundraiserId;
        private String fundraiserTitle;
        private String ngoName;
        private BigDecimal amount;
        private String date;
        private String impactMessage;
    }
}
