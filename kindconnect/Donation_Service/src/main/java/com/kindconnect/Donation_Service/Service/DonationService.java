package com.kindconnect.Donation_Service.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.kindconnect.Donation_Service.Client.ProfileClient;
import com.kindconnect.Donation_Service.DTO.AvailableForDriverDto;
import com.kindconnect.Donation_Service.DTO.CreateDonationRequest;
import com.kindconnect.Donation_Service.DTO.DriverDeliveryDto;
import com.kindconnect.Donation_Service.Exception.DonationNotFoundException;
import com.kindconnect.Donation_Service.Exception.InvalidDonationStateException;
import com.kindconnect.Donation_Service.Model.Donation;
import com.kindconnect.Donation_Service.Model.DonationStatus;
import com.kindconnect.Donation_Service.Repository.DonationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DonationService {

    private final DonationRepository donationRepository;
    private final ProfileClient profileClient;

    public Donation createDonation(Long donorUserId,
                                   CreateDonationRequest request) {

        Donation donation = new Donation();
        donation.setDonorUserId(donorUserId);
        donation.setItemType(request.getItemType());
        donation.setQuantity(request.getQuantity());
        donation.setDescription(request.getDescription());
        donation.setTargetNgoUserId(request.getTargetNgoUserId()); // Set target NGO if specified
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

    public List<Donation> getAvailableDonations(Long ngoUserId) {
        // Returns donations that are either general (no target) OR targeted to this specific NGO
        return donationRepository.findAvailableDonationsForNgo(DonationStatus.CREATED, ngoUserId);
    }

    public List<AvailableForDriverDto> getAvailableForDriver() {
        return donationRepository.findByStatus(DonationStatus.ACCEPTED)
                .stream()
                .map(d -> new AvailableForDriverDto(
                        d.getId(),
                        d.getItemType()
                ))
                .toList();
    }

    public void pickupDonation(Long donationId, Long driverUserId) {

        Donation donation = getDonation(donationId);

        if (donation.getStatus() != DonationStatus.ACCEPTED) {
            throw new InvalidDonationStateException(
                    "Donation is not ready for pickup"
            );
        }

        donation.setStatus(DonationStatus.PICKED_UP);
        donation.setDriverUserId(driverUserId);
        donation.setPickedUpAt(LocalDateTime.now());

        donationRepository.save(donation);
    }

    public void markAsDelivered(Long donationId, Long driverUserId) {

        Donation donation = getDonation(donationId);

        if (donation.getStatus() != DonationStatus.PICKED_UP) {
            throw new InvalidDonationStateException(
                    "Donation must be PICKED_UP before delivery"
            );
        }

        if (!donation.getDriverUserId().equals(driverUserId)) {
            throw new InvalidDonationStateException(
                    "Only the assigned driver can deliver this donation"
            );
        }

        donation.setStatus(DonationStatus.DELIVERED);
        donation.setDeliveredAt(LocalDateTime.now());
        donationRepository.save(donation);
    }

    // Get driver's in-transit deliveries (PICKED_UP status)
    public List<DriverDeliveryDto> getDriverInTransitDeliveries(Long driverUserId, String jwtToken) {
        return donationRepository.findByDriverUserIdAndStatus(driverUserId, DonationStatus.PICKED_UP)
                .stream()
                .map(d -> mapToDriverDeliveryDto(d, jwtToken))
                .toList();
    }

    // Get driver's completed deliveries (DELIVERED status)
    public List<DriverDeliveryDto> getDriverCompletedDeliveries(Long driverUserId, String jwtToken) {
        return donationRepository.findByDriverUserIdAndStatus(driverUserId, DonationStatus.DELIVERED)
                .stream()
                .map(d -> mapToDriverDeliveryDto(d, jwtToken))
                .toList();
    }

    // Helper method to map Donation to DriverDeliveryDto with profile details
    private DriverDeliveryDto mapToDriverDeliveryDto(Donation d, String jwtToken) {
        DriverDeliveryDto dto = new DriverDeliveryDto();
        dto.setDonationId(d.getId());
        dto.setItemType(d.getItemType());
        dto.setQuantity(d.getQuantity());
        dto.setDescription(d.getDescription());
        dto.setStatus(d.getStatus());
        dto.setCreatedAt(d.getCreatedAt());
        dto.setPickedUpAt(d.getPickedUpAt());
        dto.setDeliveredAt(d.getDeliveredAt());
        dto.setDonorUserId(d.getDonorUserId());
        dto.setNgoUserId(d.getNgoUserId());

        // Fetch NGO profile details
        if (d.getNgoUserId() != null) {
            Map<String, Object> ngoProfile = profileClient.getNgoProfileByUserId(d.getNgoUserId(), jwtToken);
            if (ngoProfile != null) {
                dto.setNgoName((String) ngoProfile.get("ngoName"));
                dto.setNgoAddress((String) ngoProfile.get("address"));
                dto.setNgoCity((String) ngoProfile.get("city"));
                dto.setNgoPhone((String) ngoProfile.get("phone"));
            }
        }

        // Fetch Donor profile details
        if (d.getDonorUserId() != null) {
            Map<String, Object> donorProfile = profileClient.getDonorProfileByUserId(d.getDonorUserId(), jwtToken);
            if (donorProfile != null) {
                dto.setDonorName((String) donorProfile.get("name"));
                dto.setDonorAddress((String) donorProfile.get("address"));
                dto.setDonorCity((String) donorProfile.get("city"));
                dto.setDonorPhone((String) donorProfile.get("phone"));
            }
        }

        return dto;
    }

}
