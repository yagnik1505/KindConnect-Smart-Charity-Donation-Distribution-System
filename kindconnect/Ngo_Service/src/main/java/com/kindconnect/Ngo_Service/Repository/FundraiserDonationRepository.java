package com.kindconnect.Ngo_Service.Repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.kindconnect.Ngo_Service.Model.FundraiserDonation;

@Repository
public interface FundraiserDonationRepository extends JpaRepository<FundraiserDonation, Long> {

    // Find donations for a fundraiser
    List<FundraiserDonation> findByFundraiserIdOrderByDonatedAtDesc(Long fundraiserId);

    // Find donations by donor
    List<FundraiserDonation> findByDonorUserIdOrderByDonatedAtDesc(Long donorUserId);

    // Count donors for a fundraiser
    long countByFundraiserId(Long fundraiserId);

    // Sum amount for a fundraiser
    @Query("SELECT COALESCE(SUM(fd.amount), 0) FROM FundraiserDonation fd WHERE fd.fundraiserId = :fundraiserId AND fd.paymentStatus = 'COMPLETED'")
    BigDecimal sumAmountByFundraiserId(@Param("fundraiserId") Long fundraiserId);

    // Recent donations for a fundraiser
    List<FundraiserDonation> findByFundraiserIdAndPaymentStatusOrderByDonatedAtDesc(Long fundraiserId, String paymentStatus, Pageable pageable);

    // Top donors for a fundraiser
    @Query("SELECT fd FROM FundraiserDonation fd WHERE fd.fundraiserId = :fundraiserId AND fd.paymentStatus = 'COMPLETED' ORDER BY fd.amount DESC")
    List<FundraiserDonation> findTopDonors(@Param("fundraiserId") Long fundraiserId, Pageable pageable);
    
    // ============ IMPACT STATISTICS QUERIES ============
    
    // Count total donations by donor
    @Query("SELECT COUNT(fd) FROM FundraiserDonation fd WHERE fd.donorUserId = :donorUserId AND fd.paymentStatus = 'COMPLETED'")
    Long countByDonorUserId(@Param("donorUserId") Long donorUserId);
    
    // Sum total amount donated by donor
    @Query("SELECT COALESCE(SUM(fd.amount), 0) FROM FundraiserDonation fd WHERE fd.donorUserId = :donorUserId AND fd.paymentStatus = 'COMPLETED'")
    BigDecimal sumAmountByDonorUserId(@Param("donorUserId") Long donorUserId);
    
    // Count unique fundraisers supported by donor
    @Query("SELECT COUNT(DISTINCT fd.fundraiserId) FROM FundraiserDonation fd WHERE fd.donorUserId = :donorUserId AND fd.paymentStatus = 'COMPLETED'")
    Long countUniqueFundraisersByDonorUserId(@Param("donorUserId") Long donorUserId);
    
    // Get donor's completed donations ordered by date
    List<FundraiserDonation> findByDonorUserIdAndPaymentStatusOrderByDonatedAtDesc(Long donorUserId, String paymentStatus);
    
    // Count total donors (for ranking)
    @Query("SELECT COUNT(DISTINCT fd.donorUserId) FROM FundraiserDonation fd WHERE fd.paymentStatus = 'COMPLETED'")
    Long countUniqueDonors();
    
    // Get donor rank by total amount
    @Query("SELECT COUNT(DISTINCT fd.donorUserId) FROM FundraiserDonation fd WHERE fd.paymentStatus = 'COMPLETED' GROUP BY fd.donorUserId HAVING SUM(fd.amount) > :amount")
    Long countDonorsWithAmountGreaterThan(@Param("amount") BigDecimal amount);
}
