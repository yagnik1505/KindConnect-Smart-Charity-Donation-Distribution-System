package com.kindconnect.Ngo_Service.Repository;

import com.kindconnect.Ngo_Service.Model.NgoAcceptedDonation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NgoAcceptedDonationRepository
        extends JpaRepository<NgoAcceptedDonation, Long> {

    List<NgoAcceptedDonation> findByNgoUserId(Long ngoUserId);

    Optional<NgoAcceptedDonation> findByDonationId(Long donationId);

    boolean existsByDonationId(Long donationId);
}

