package com.kindconnect.Ngo_Service.Service;

import com.kindconnect.Ngo_Service.Model.DonationClient;
import com.kindconnect.Ngo_Service.DTO.*;
import com.kindconnect.Ngo_Service.Exception.InvalidOperationException;
import com.kindconnect.Ngo_Service.Model.NgoAcceptedDonation;
import com.kindconnect.Ngo_Service.Model.NgoDonationStatus;
import com.kindconnect.Ngo_Service.Repository.NgoAcceptedDonationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NgoService {

    private final NgoAcceptedDonationRepository repository;
    private final DonationClient donationClient;

    // ================= ACCEPT DONATION =================
    public void acceptDonation(Long donationId,
                               Long ngoUserId,
                               String jwtToken) {

        if (repository.existsByDonationId(donationId)) {
            throw new InvalidOperationException(
                    "Donation already accepted by another NGO"
            );
        }

        // 🔥 Update DONATION SERVICE first
        donationClient.acceptDonation(donationId, jwtToken);

        // ✅ Save NGO decision
        NgoAcceptedDonation donation = new NgoAcceptedDonation();
        donation.setDonationId(donationId);
        donation.setNgoUserId(ngoUserId);
        donation.setStatus(NgoDonationStatus.ACCEPTED);
        donation.setAcceptedAt(LocalDateTime.now());

        repository.save(donation);
    }

    // ================= MY DONATIONS =================
    public List<NgoDonationResponseDto> getMyDonations(Long ngoUserId) {
        return repository.findByNgoUserId(ngoUserId)
                .stream()
                .map(d -> new NgoDonationResponseDto(
                        d.getDonationId(),
                        d.getStatus(),
                        d.getAcceptedAt()
                ))
                .toList();
    }

    // ================= CANCEL DONATION =================
    public void cancelDonation(Long donationId,
                               Long ngoUserId,
                               String jwtToken) {

        NgoAcceptedDonation donation =
                repository.findByDonationId(donationId)
                        .orElseThrow(() ->
                                new InvalidOperationException("Donation not found")
                        );

        if (!donation.getNgoUserId().equals(ngoUserId)) {
            throw new InvalidOperationException(
                    "You are not allowed to cancel this donation"
            );
        }

        if (donation.getStatus() == NgoDonationStatus.CANCELLED) {
            throw new InvalidOperationException(
                    "Donation already cancelled"
            );
        }

        // 🔥 Inform DONATION SERVICE
        donationClient.cancelByNgo(donationId, jwtToken);

        // ✅ Update NGO DB
        donation.setStatus(NgoDonationStatus.CANCELLED);
        repository.save(donation);
    }

    // ================= DASHBOARD =================
    public NgoDashboardDto dashboard(Long ngoUserId) {
        List<NgoAcceptedDonation> list =
                repository.findByNgoUserId(ngoUserId);

        long total = list.size();
        long cancelled = list.stream()
                .filter(d -> d.getStatus() == NgoDonationStatus.CANCELLED)
                .count();

        long active = total - cancelled;

        return new NgoDashboardDto(total, active, cancelled);
    }
}
