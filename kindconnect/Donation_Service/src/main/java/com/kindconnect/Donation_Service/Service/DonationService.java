package com.kindconnect.Donation_Service.Service;

import com.kindconnect.Donation_Service.DTO.CreateDonationRequest;
import com.kindconnect.Donation_Service.Exception.DonationNotFoundException;
import com.kindconnect.Donation_Service.Exception.InvalidDonationStateException;
import com.kindconnect.Donation_Service.Model.Donation;
import com.kindconnect.Donation_Service.Model.DonationStatus;
import com.kindconnect.Donation_Service.Repository.DonationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DonationService {

    private final DonationRepository donationRepository;

    public Donation createDonation(Long donorUserId,
                                   CreateDonationRequest request) {

        Donation donation = new Donation();
        donation.setDonorUserId(donorUserId);
        donation.setItemType(request.getItemType());
        donation.setQuantity(request.getQuantity());
        donation.setDescription(request.getDescription());
        donation.setStatus(DonationStatus.CREATED);
        donation.setCreatedAt(LocalDateTime.now());

        return donationRepository.save(donation);
    }

    public List<Donation> getMyDonations(Long donorUserId) {
        return donationRepository.findByDonorUserId(donorUserId);
    }

    public Donation getDonation(Long donationId) {
        return donationRepository.findById(donationId)
                .orElseThrow(() ->
                        new DonationNotFoundException("Donation not found"));
    }

    public void cancelDonation(Long donationId, Long donorUserId) {

        Donation donation = getDonation(donationId);

        if (!donation.getDonorUserId().equals(donorUserId)) {
            throw new InvalidDonationStateException(
                    "You cannot cancel this donation"
            );
        }

        if (donation.getStatus() != DonationStatus.CREATED) {
            throw new InvalidDonationStateException(
                    "Donation cannot be cancelled now"
            );
        }

        donation.setStatus(DonationStatus.CANCELLED);
        donationRepository.save(donation);
    }

    public void acceptDonation(Long donationId, Long ngoUserId) {

        Donation donation = getDonation(donationId);

        if (donation.getStatus() != DonationStatus.CREATED) {
            throw new InvalidDonationStateException(
                    "Donation is not available"
            );
        }

        donation.setNgoUserId(ngoUserId);
        donation.setStatus(DonationStatus.ACCEPTED);
        donationRepository.save(donation);
    }

    public void cancelByNgo(Long donationId) {

        Donation donation = getDonation(donationId);

        if (donation.getStatus() != DonationStatus.ACCEPTED) {
            throw new InvalidDonationStateException(
                    "Donation cannot be cancelled by NGO"
            );
        }

        donation.setNgoUserId(null);
        donation.setStatus(DonationStatus.CREATED);
        donationRepository.save(donation);
    }

    public List<Donation> getAvailableDonations() {
        return donationRepository.findByStatus(DonationStatus.CREATED);
    }
}
