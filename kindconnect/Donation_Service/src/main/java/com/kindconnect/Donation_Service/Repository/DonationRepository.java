package com.kindconnect.Donation_Service.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.kindconnect.Donation_Service.Model.Donation;
import com.kindconnect.Donation_Service.Model.DonationStatus;

@Repository
public interface DonationRepository extends JpaRepository<Donation,Long> {

    List<Donation> findByDonorUserId(Long donorUserId);

    List<Donation> findByStatus(DonationStatus donationStatus);

    // Find available donations for a specific NGO
    // Returns donations that are either general (targetNgoUserId is null) OR targeted to this NGO
    @Query("SELECT d FROM Donation d WHERE d.status = :status AND (d.targetNgoUserId IS NULL OR d.targetNgoUserId = :ngoUserId)")
    List<Donation> findAvailableDonationsForNgo(@Param("status") DonationStatus status, @Param("ngoUserId") Long ngoUserId);

    // Find donations assigned to a specific driver
    List<Donation> findByDriverUserId(Long driverUserId);

    // Find driver's deliveries by status
    List<Donation> findByDriverUserIdAndStatus(Long driverUserId, DonationStatus status);
}
