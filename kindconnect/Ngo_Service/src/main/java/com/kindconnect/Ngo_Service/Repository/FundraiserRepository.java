package com.kindconnect.Ngo_Service.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.kindconnect.Ngo_Service.Model.Fundraiser;
import com.kindconnect.Ngo_Service.Model.FundraiserCategory;
import com.kindconnect.Ngo_Service.Model.FundraiserStatus;

@Repository
public interface FundraiserRepository extends JpaRepository<Fundraiser, Long> {

    // Find all fundraisers by NGO
    List<Fundraiser> findByNgoUserIdOrderByCreatedAtDesc(Long ngoUserId);

    // Find active fundraisers
    List<Fundraiser> findByStatusOrderByCreatedAtDesc(FundraiserStatus status);

    // Find by category
    List<Fundraiser> findByCategoryAndStatusOrderByCreatedAtDesc(FundraiserCategory category, FundraiserStatus status);

    // Find featured fundraisers
    List<Fundraiser> findByFeaturedTrueAndStatusOrderByCreatedAtDesc(FundraiserStatus status);

    // Search fundraisers by title or description
    @Query("SELECT f FROM Fundraiser f WHERE f.status = :status AND " +
           "(LOWER(f.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(f.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Fundraiser> searchFundraisers(@Param("search") String search, @Param("status") FundraiserStatus status);

    // Find urgent fundraisers
    List<Fundraiser> findByUrgencyLevelAndStatusOrderByCreatedAtDesc(String urgencyLevel, FundraiserStatus status);

    // Count by NGO
    long countByNgoUserId(Long ngoUserId);

    // Find with pagination
    Page<Fundraiser> findByStatusOrderByCreatedAtDesc(FundraiserStatus status, Pageable pageable);

    // Top fundraisers by amount raised
    @Query("SELECT f FROM Fundraiser f WHERE f.status = :status ORDER BY f.currentAmount DESC")
    List<Fundraiser> findTopFundraisers(@Param("status") FundraiserStatus status, Pageable pageable);

    // Almost completed fundraisers (above 80% funded)
    @Query("SELECT f FROM Fundraiser f WHERE f.status = :status AND " +
           "(f.currentAmount / f.targetAmount) >= 0.8 ORDER BY f.currentAmount DESC")
    List<Fundraiser> findAlmostCompletedFundraisers(@Param("status") FundraiserStatus status);
}
