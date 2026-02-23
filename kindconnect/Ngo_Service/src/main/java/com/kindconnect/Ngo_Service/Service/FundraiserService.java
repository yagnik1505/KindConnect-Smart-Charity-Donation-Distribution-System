package com.kindconnect.Ngo_Service.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kindconnect.Ngo_Service.Client.ProfileClient;
import com.kindconnect.Ngo_Service.DTO.CreateFundraiserRequest;
import com.kindconnect.Ngo_Service.DTO.FundraiserDonationRequest;
import com.kindconnect.Ngo_Service.DTO.FundraiserDonationResponse;
import com.kindconnect.Ngo_Service.DTO.FundraiserResponse;
import com.kindconnect.Ngo_Service.DTO.ImpactStatsResponse;
import com.kindconnect.Ngo_Service.Model.Fundraiser;
import com.kindconnect.Ngo_Service.Model.FundraiserCategory;
import com.kindconnect.Ngo_Service.Model.FundraiserDonation;
import com.kindconnect.Ngo_Service.Model.FundraiserStatus;
import com.kindconnect.Ngo_Service.Repository.FundraiserDonationRepository;
import com.kindconnect.Ngo_Service.Repository.FundraiserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FundraiserService {

    private final FundraiserRepository fundraiserRepository;
    private final FundraiserDonationRepository donationRepository;
    private final ProfileClient profileClient;

    // Create a new fundraiser
    @Transactional
    public FundraiserResponse createFundraiser(Long ngoUserId, String jwtToken, CreateFundraiserRequest request) {
        // Fetch NGO profile to get the NGO name and UPI ID
        Map<String, Object> ngoProfile = profileClient.getNgoProfileByUserId(ngoUserId, jwtToken);
        String ngoName = "NGO"; // Default fallback
        String upiId = null; // Default to null
        
        if (ngoProfile != null) {
            if (ngoProfile.get("ngoName") != null) {
                ngoName = ngoProfile.get("ngoName").toString();
            }
            // Auto-fetch UPI ID from profile if not provided in request
            if (request.getUpiId() == null && ngoProfile.get("upiId") != null) {
                upiId = ngoProfile.get("upiId").toString();
            }
        }
        
        // Allow request to override profile UPI ID
        if (request.getUpiId() != null) {
            upiId = request.getUpiId();
        }
        
        Fundraiser fundraiser = new Fundraiser();
        fundraiser.setNgoUserId(ngoUserId);
        fundraiser.setNgoName(ngoName);
        fundraiser.setUpiId(upiId);
        fundraiser.setTitle(request.getTitle());
        fundraiser.setDescription(request.getDescription());
        fundraiser.setStory(request.getStory());
        fundraiser.setCategory(request.getCategory());
        fundraiser.setTargetAmount(request.getTargetAmount());
        fundraiser.setImageUrl(request.getImageUrl());
        fundraiser.setAdditionalImages(request.getAdditionalImages());
        fundraiser.setVideoUrl(request.getVideoUrl());
        fundraiser.setStartDate(LocalDateTime.now());
        fundraiser.setEndDate(request.getEndDate());
        fundraiser.setBeneficiaryName(request.getBeneficiaryName());
        fundraiser.setBeneficiaryLocation(request.getBeneficiaryLocation());
        fundraiser.setUrgencyLevel(request.getUrgencyLevel());
        fundraiser.setStatus(FundraiserStatus.ACTIVE);

        Fundraiser saved = fundraiserRepository.save(fundraiser);
        return mapToResponse(saved);
    }

    // Get fundraiser by ID
    public FundraiserResponse getFundraiserById(Long id) {
        Fundraiser fundraiser = fundraiserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fundraiser not found"));
        return mapToResponse(fundraiser);
    }

    // Get all active fundraisers
    public List<FundraiserResponse> getActiveFundraisers() {
        return fundraiserRepository.findByStatusOrderByCreatedAtDesc(FundraiserStatus.ACTIVE)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get fundraisers by category
    public List<FundraiserResponse> getFundraisersByCategory(FundraiserCategory category) {
        return fundraiserRepository.findByCategoryAndStatusOrderByCreatedAtDesc(category, FundraiserStatus.ACTIVE)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get featured fundraisers
    public List<FundraiserResponse> getFeaturedFundraisers() {
        return fundraiserRepository.findByFeaturedTrueAndStatusOrderByCreatedAtDesc(FundraiserStatus.ACTIVE)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get NGO's fundraisers
    public List<FundraiserResponse> getNgoFundraisers(Long ngoUserId) {
        return fundraiserRepository.findByNgoUserIdOrderByCreatedAtDesc(ngoUserId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Search fundraisers
    public List<FundraiserResponse> searchFundraisers(String query) {
        return fundraiserRepository.searchFundraisers(query, FundraiserStatus.ACTIVE)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get urgent fundraisers
    public List<FundraiserResponse> getUrgentFundraisers() {
        return fundraiserRepository.findByUrgencyLevelAndStatusOrderByCreatedAtDesc("CRITICAL", FundraiserStatus.ACTIVE)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Update fundraiser
    @Transactional
    public FundraiserResponse updateFundraiser(Long id, Long ngoUserId, CreateFundraiserRequest request) {
        Fundraiser fundraiser = fundraiserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fundraiser not found"));

        if (!fundraiser.getNgoUserId().equals(ngoUserId)) {
            throw new RuntimeException("Unauthorized to update this fundraiser");
        }

        if (request.getTitle() != null) fundraiser.setTitle(request.getTitle());
        if (request.getDescription() != null) fundraiser.setDescription(request.getDescription());
        if (request.getStory() != null) fundraiser.setStory(request.getStory());
        if (request.getCategory() != null) fundraiser.setCategory(request.getCategory());
        if (request.getTargetAmount() != null) fundraiser.setTargetAmount(request.getTargetAmount());
        if (request.getImageUrl() != null) fundraiser.setImageUrl(request.getImageUrl());
        if (request.getAdditionalImages() != null) fundraiser.setAdditionalImages(request.getAdditionalImages());
        if (request.getVideoUrl() != null) fundraiser.setVideoUrl(request.getVideoUrl());
        if (request.getEndDate() != null) fundraiser.setEndDate(request.getEndDate());
        if (request.getBeneficiaryName() != null) fundraiser.setBeneficiaryName(request.getBeneficiaryName());
        if (request.getBeneficiaryLocation() != null) fundraiser.setBeneficiaryLocation(request.getBeneficiaryLocation());
        if (request.getUrgencyLevel() != null) fundraiser.setUrgencyLevel(request.getUrgencyLevel());
        if (request.getUpiId() != null) fundraiser.setUpiId(request.getUpiId());

        Fundraiser saved = fundraiserRepository.save(fundraiser);
        return mapToResponse(saved);
    }

    // Pause/Resume fundraiser
    @Transactional
    public FundraiserResponse toggleFundraiserStatus(Long id, Long ngoUserId) {
        Fundraiser fundraiser = fundraiserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fundraiser not found"));

        if (!fundraiser.getNgoUserId().equals(ngoUserId)) {
            throw new RuntimeException("Unauthorized");
        }

        if (fundraiser.getStatus() == FundraiserStatus.ACTIVE) {
            fundraiser.setStatus(FundraiserStatus.PAUSED);
        } else if (fundraiser.getStatus() == FundraiserStatus.PAUSED) {
            fundraiser.setStatus(FundraiserStatus.ACTIVE);
        }

        return mapToResponse(fundraiserRepository.save(fundraiser));
    }

    // Donate to fundraiser
    @Transactional
    public FundraiserDonationResponse donateToFundraiser(Long fundraiserId, Long donorUserId, 
                                                          String jwtToken, FundraiserDonationRequest request) {
        Fundraiser fundraiser = fundraiserRepository.findById(fundraiserId)
                .orElseThrow(() -> new RuntimeException("Fundraiser not found"));

        if (fundraiser.getStatus() != FundraiserStatus.ACTIVE) {
            throw new RuntimeException("This fundraiser is not accepting donations");
        }

        // Fetch donor profile to get the donor name
        Map<String, Object> donorProfile = profileClient.getDonorProfileByUserId(donorUserId, jwtToken);
        String donorName = "Donor"; // Default fallback
        if (donorProfile != null && donorProfile.get("name") != null) {
            donorName = donorProfile.get("name").toString();
        }

        FundraiserDonation donation = new FundraiserDonation();
        donation.setFundraiserId(fundraiserId);
        donation.setDonorUserId(donorUserId);
        donation.setDonorName(request.getAnonymous() ? "Anonymous" : donorName);
        donation.setAmount(request.getAmount());
        donation.setMessage(request.getMessage());
        donation.setAnonymous(request.getAnonymous());
        donation.setPaymentId(request.getPaymentId());
        donation.setPaymentStatus("COMPLETED"); // For now, assuming instant payment

        FundraiserDonation savedDonation = donationRepository.save(donation);

        // Update fundraiser totals
        fundraiser.setCurrentAmount(fundraiser.getCurrentAmount().add(request.getAmount()));
        fundraiser.setTotalDonors(fundraiser.getTotalDonors() + 1);

        // Check if target reached
        if (fundraiser.getCurrentAmount().compareTo(fundraiser.getTargetAmount()) >= 0) {
            fundraiser.setStatus(FundraiserStatus.COMPLETED);
        }

        fundraiserRepository.save(fundraiser);

        return mapToDonationResponse(savedDonation, fundraiser.getTitle());
    }

    // Get donations for a fundraiser
    public List<FundraiserDonationResponse> getFundraiserDonations(Long fundraiserId) {
        Fundraiser fundraiser = fundraiserRepository.findById(fundraiserId)
                .orElseThrow(() -> new RuntimeException("Fundraiser not found"));

        return donationRepository.findByFundraiserIdOrderByDonatedAtDesc(fundraiserId)
                .stream()
                .map(d -> mapToDonationResponse(d, fundraiser.getTitle()))
                .collect(Collectors.toList());
    }

    // Get recent donations for a fundraiser (top 10)
    public List<FundraiserDonationResponse> getRecentDonations(Long fundraiserId) {
        Fundraiser fundraiser = fundraiserRepository.findById(fundraiserId)
                .orElseThrow(() -> new RuntimeException("Fundraiser not found"));

        return donationRepository.findByFundraiserIdAndPaymentStatusOrderByDonatedAtDesc(
                        fundraiserId, "COMPLETED", PageRequest.of(0, 10))
                .stream()
                .map(d -> mapToDonationResponse(d, fundraiser.getTitle()))
                .collect(Collectors.toList());
    }

    // Get donor's donations
    public List<FundraiserDonationResponse> getDonorDonations(Long donorUserId) {
        return donationRepository.findByDonorUserIdOrderByDonatedAtDesc(donorUserId)
                .stream()
                .map(d -> {
                    Fundraiser f = fundraiserRepository.findById(d.getFundraiserId()).orElse(null);
                    return mapToDonationResponse(d, f != null ? f.getTitle() : "Unknown");
                })
                .collect(Collectors.toList());
    }

    // Helper method to map entity to response
    private FundraiserResponse mapToResponse(Fundraiser fundraiser) {
        FundraiserResponse response = new FundraiserResponse();
        response.setId(fundraiser.getId());
        response.setNgoUserId(fundraiser.getNgoUserId());
        response.setNgoName(fundraiser.getNgoName());
        response.setUpiId(fundraiser.getUpiId());
        response.setTitle(fundraiser.getTitle());
        response.setDescription(fundraiser.getDescription());
        response.setStory(fundraiser.getStory());
        response.setCategory(fundraiser.getCategory());
        response.setTargetAmount(fundraiser.getTargetAmount());
        response.setCurrentAmount(fundraiser.getCurrentAmount());
        response.setPercentageFunded(fundraiser.getPercentageFunded());
        response.setImageUrl(fundraiser.getImageUrl());
        response.setAdditionalImages(fundraiser.getAdditionalImages());
        response.setVideoUrl(fundraiser.getVideoUrl());
        response.setStartDate(fundraiser.getStartDate());
        response.setEndDate(fundraiser.getEndDate());
        response.setStatus(fundraiser.getStatus());
        response.setTotalDonors(fundraiser.getTotalDonors());
        response.setBeneficiaryName(fundraiser.getBeneficiaryName());
        response.setBeneficiaryLocation(fundraiser.getBeneficiaryLocation());
        response.setUrgencyLevel(fundraiser.getUrgencyLevel());
        response.setCreatedAt(fundraiser.getCreatedAt());
        response.setFeatured(fundraiser.getFeatured());
        response.setIsActive(fundraiser.isActive());

        // Calculate days left
        if (fundraiser.getEndDate() != null) {
            long daysLeft = ChronoUnit.DAYS.between(LocalDateTime.now(), fundraiser.getEndDate());
            response.setDaysLeft(Math.max(0, daysLeft));
        }

        return response;
    }

    private FundraiserDonationResponse mapToDonationResponse(FundraiserDonation donation, String fundraiserTitle) {
        FundraiserDonationResponse response = new FundraiserDonationResponse();
        response.setId(donation.getId());
        response.setFundraiserId(donation.getFundraiserId());
        response.setFundraiserTitle(fundraiserTitle);
        response.setDonorUserId(donation.getDonorUserId());
        response.setDonorName(donation.getAnonymous() ? "Anonymous" : donation.getDonorName());
        response.setAmount(donation.getAmount());
        response.setMessage(donation.getMessage());
        response.setAnonymous(donation.getAnonymous());
        response.setDonatedAt(donation.getDonatedAt());
        return response;
    }
    
    // ============ IMPACT STATISTICS ============
    
    public ImpactStatsResponse getDonorImpactStats(Long donorUserId) {
        // Get basic statistics
        Long totalDonations = donationRepository.countByDonorUserId(donorUserId);
        BigDecimal totalAmount = donationRepository.sumAmountByDonorUserId(donorUserId);
        Long fundraisersSupported = donationRepository.countUniqueFundraisersByDonorUserId(donorUserId);
        
        // Calculate streak (consecutive months with donations)
        int streak = calculateDonationStreak(donorUserId);
        
        // Calculate rankings
        Long totalDonors = donationRepository.countUniqueDonors();
        Long donorsAbove = donationRepository.countDonorsWithAmountGreaterThan(totalAmount);
        int overallRank = donorsAbove != null ? donorsAbove.intValue() + 1 : 1;
        
        // Get donor's donations
        List<FundraiserDonation> donations = donationRepository.findByDonorUserIdAndPaymentStatusOrderByDonatedAtDesc(
                donorUserId, "COMPLETED");
        
        // Calculate monthly breakdown (last 6 months)
        List<ImpactStatsResponse.MonthlyDonation> monthlyDonations = calculateMonthlyDonations(donations);
        
        // Calculate category breakdown
        Map<String, ImpactStatsResponse.CategoryImpact> categoryBreakdown = calculateCategoryBreakdown(donations);
        
        // Get recent impacts
        List<ImpactStatsResponse.RecentImpact> recentImpacts = calculateRecentImpacts(donations);
        
        // Generate achievement badges
        List<ImpactStatsResponse.AchievementBadge> badges = generateAchievementBadges(totalDonations.intValue(), 
                totalAmount, fundraisersSupported.intValue(), streak);
        
        return ImpactStatsResponse.builder()
                .totalDonations(totalDonations.intValue())
                .totalAmountDonated(totalAmount)
                .fundraisersSupported(fundraisersSupported.intValue())
                .consecutiveDonationStreak(streak)
                .overallRank(overallRank)
                .badges(badges)
                .monthlyDonations(monthlyDonations)
                .categoryBreakdown(categoryBreakdown)
                .recentImpacts(recentImpacts)
                .build();
    }
    
    private int calculateDonationStreak(Long donorUserId) {
        List<FundraiserDonation> donations = donationRepository.findByDonorUserIdAndPaymentStatusOrderByDonatedAtDesc(
                donorUserId, "COMPLETED");
        
        if (donations.isEmpty()) {
            return 0;
        }
        
        // Group by month
        Map<String, List<FundraiserDonation>> byMonth = donations.stream()
                .collect(Collectors.groupingBy(d -> 
                        d.getDonatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM"))));
        
        int streak = 0;
        LocalDateTime current = LocalDateTime.now();
        
        // Check consecutive months from current month backwards
        for (int i = 0; i < 12; i++) {
            String monthKey = current.minusMonths(i).format(DateTimeFormatter.ofPattern("yyyy-MM"));
            if (byMonth.containsKey(monthKey)) {
                streak++;
            } else if (streak > 0) {
                break; // Stop if we hit a month without donations
            }
        }
        
        return streak;
    }
    
    private List<ImpactStatsResponse.MonthlyDonation> calculateMonthlyDonations(List<FundraiserDonation> donations) {
        Map<String, List<FundraiserDonation>> byMonth = donations.stream()
                .filter(d -> d.getDonatedAt().isAfter(LocalDateTime.now().minusMonths(6)))
                .collect(Collectors.groupingBy(d -> 
                        d.getDonatedAt().format(DateTimeFormatter.ofPattern("MMM yyyy"))));
        
        List<ImpactStatsResponse.MonthlyDonation> result = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            LocalDateTime month = LocalDateTime.now().minusMonths(i);
            String monthKey = month.format(DateTimeFormatter.ofPattern("MMM yyyy"));
            
            List<FundraiserDonation> monthDonations = byMonth.getOrDefault(monthKey, new ArrayList<>());
            BigDecimal monthAmount = monthDonations.stream()
                    .map(FundraiserDonation::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            result.add(ImpactStatsResponse.MonthlyDonation.builder()
                    .month(monthKey)
                    .count(monthDonations.size())
                    .amount(monthAmount)
                    .build());
        }
        
        return result;
    }
    
    private Map<String, ImpactStatsResponse.CategoryImpact> calculateCategoryBreakdown(List<FundraiserDonation> donations) {
        Map<String, ImpactStatsResponse.CategoryImpact> result = new HashMap<>();
        
        BigDecimal totalAmount = donations.stream()
                .map(FundraiserDonation::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        for (FundraiserDonation donation : donations) {
            Fundraiser fundraiser = fundraiserRepository.findById(donation.getFundraiserId()).orElse(null);
            if (fundraiser != null) {
                String categoryName = fundraiser.getCategory().name();
                ImpactStatsResponse.CategoryImpact impact = result.getOrDefault(categoryName, 
                        ImpactStatsResponse.CategoryImpact.builder()
                                .category(categoryName)
                                .donationCount(0)
                                .totalAmount(BigDecimal.ZERO)
                                .percentage(0.0)
                                .build());
                
                impact.setDonationCount(impact.getDonationCount() + 1);
                impact.setTotalAmount(impact.getTotalAmount().add(donation.getAmount()));
                
                if (totalAmount.compareTo(BigDecimal.ZERO) > 0) {
                    double percentage = impact.getTotalAmount()
                            .divide(totalAmount, 4, RoundingMode.HALF_UP)
                            .multiply(new BigDecimal(100))
                            .doubleValue();
                    impact.setPercentage(percentage);
                }
                
                result.put(categoryName, impact);
            }
        }
        
        return result;
    }
    
    private List<ImpactStatsResponse.RecentImpact> calculateRecentImpacts(List<FundraiserDonation> donations) {
        return donations.stream()
                .limit(5)
                .map(donation -> {
                    Fundraiser fundraiser = fundraiserRepository.findById(donation.getFundraiserId()).orElse(null);
                    String impactMessage = generateImpactMessage(donation.getAmount(), 
                            fundraiser != null ? fundraiser.getCategory() : null);
                    
                    return ImpactStatsResponse.RecentImpact.builder()
                            .fundraiserId(donation.getFundraiserId())
                            .fundraiserTitle(fundraiser != null ? fundraiser.getTitle() : "Unknown")
                            .ngoName(fundraiser != null ? fundraiser.getNgoName() : "Unknown")
                            .amount(donation.getAmount())
                            .date(donation.getDonatedAt().format(DateTimeFormatter.ofPattern("dd MMM yyyy")))
                            .impactMessage(impactMessage)
                            .build();
                })
                .collect(Collectors.toList());
    }
    
    private String generateImpactMessage(BigDecimal amount, FundraiserCategory category) {
        if (category == null) {
            return "Your contribution is making a difference!";
        }
        
        int value = amount.intValue();
        switch (category) {
            case EDUCATION:
                return "Helped provide education materials for " + (value / 100) + " students";
            case HEALTHCARE:
                return "Contributed to medical treatment for " + (value / 500) + " patients";
            case FOOD_HUNGER:
                return "Helped feed " + (value / 50) + " families for a day";
            case CHILDREN_WELFARE:
                return "Supported care for " + (value / 200) + " children";
            case ELDERLY_CARE:
                return "Helped provide care for " + (value / 150) + " elderly persons";
            case DISASTER_RELIEF:
                return "Aided " + (value / 300) + " families affected by disaster";
            case ANIMAL_WELFARE:
                return "Helped care for " + (value / 100) + " animals";
            case ENVIRONMENT:
                return "Contributed to planting " + (value / 20) + " trees";
            case WOMEN_EMPOWERMENT:
                return "Supported " + (value / 250) + " women's empowerment programs";
            case DISABILITY_SUPPORT:
                return "Provided support for " + (value / 300) + " persons with disabilities";
            case COMMUNITY_DEVELOPMENT:
                return "Contributed to " + (value / 400) + " community development projects";
            case OTHER:
                return "Your contribution is making a difference!";
            default:
                return "Your contribution is making a difference!";
        }
    }
    
    private List<ImpactStatsResponse.AchievementBadge> generateAchievementBadges(int totalDonations, 
            BigDecimal totalAmount, int fundraisersSupported, int streak) {
        List<ImpactStatsResponse.AchievementBadge> badges = new ArrayList<>();
        
        // First Donation Badge
        if (totalDonations >= 1) {
            badges.add(createBadge("first-donation", "First Step", 
                    "Made your first donation", "🎯", "#10B981", totalDonations, 1));
        }
        
        // Regular Giver Badge
        if (totalDonations >= 5) {
            badges.add(createBadge("regular-giver", "Regular Giver", 
                    "Made 5 donations", "⭐", "#3B82F6", totalDonations, 5));
        }
        
        // Dedicated Supporter Badge
        if (totalDonations >= 10) {
            badges.add(createBadge("dedicated-supporter", "Dedicated Supporter", 
                    "Made 10 donations", "💫", "#8B5CF6", totalDonations, 10));
        }
        
        // Community Champion Badge
        if (totalDonations >= 25) {
            badges.add(createBadge("community-champion", "Community Champion", 
                    "Made 25 donations", "🏆", "#F59E0B", totalDonations, 25));
        }
        
        // Generous Heart Badge (₹5000+)
        int amountMilestone = 5000;
        if (totalAmount.compareTo(new BigDecimal(amountMilestone)) >= 0) {
            badges.add(createBadge("generous-heart", "Generous Heart", 
                    "Donated over ₹5000", "💝", "#EC4899", totalAmount.intValue(), amountMilestone));
        }
        
        // Big Donor Badge (₹10000+)
        int bigDonorMilestone = 10000;
        if (totalAmount.compareTo(new BigDecimal(bigDonorMilestone)) >= 0) {
            badges.add(createBadge("big-donor", "Big Donor", 
                    "Donated over ₹10,000", "💎", "#6366F1", totalAmount.intValue(), bigDonorMilestone));
        }
        
        // Diverse Impact Badge
        if (fundraisersSupported >= 5) {
            badges.add(createBadge("diverse-impact", "Diverse Impact", 
                    "Supported 5 different causes", "🌈", "#14B8A6", fundraisersSupported, 5));
        }
        
        // Monthly Streak Badge
        if (streak >= 3) {
            badges.add(createBadge("monthly-streak", "Consistent Giver", 
                    "Donated for 3 consecutive months", "🔥", "#EF4444", streak, 3));
        }
        
        return badges;
    }
    
    private ImpactStatsResponse.AchievementBadge createBadge(String id, String name, String description, 
            String icon, String color, int progress, int target) {
        return ImpactStatsResponse.AchievementBadge.builder()
                .id(id)
                .name(name)
                .description(description)
                .icon(icon)
                .color(color)
                .unlockedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy")))
                .progress(progress)
                .target(target)
                .build();
    }
}
