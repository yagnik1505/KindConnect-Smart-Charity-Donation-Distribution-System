package com.kindconnect.Driver_Service.Service;

import com.kindconnect.Driver_Service.DTO.DriverDashboardDto;
import com.kindconnect.Driver_Service.Model.ActionType;
import com.kindconnect.Driver_Service.Model.DriverAction;
import com.kindconnect.Driver_Service.Repository.DriverActionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DriverDashboardService {

    private final DriverActionRepository repository;

    // ✅ Save pickup
    public void recordPickup(Long driverUserId, Long donationId) {
        saveAction(driverUserId, donationId, ActionType.PICKUP);
    }

    // ✅ Save delivery
    public void recordDelivery(Long driverUserId, Long donationId) {
        saveAction(driverUserId, donationId, ActionType.DELIVERY);
    }

    private void saveAction(Long driverUserId, Long donationId, ActionType type) {
        DriverAction action = new DriverAction();
        action.setDriverUserId(driverUserId);
        action.setDonationId(donationId);
        action.setActionType(type);
        action.setActionTime(LocalDateTime.now());
        repository.save(action);
    }

    // 📊 Dashboard
    public DriverDashboardDto getDashboard(Long driverUserId) {
        long pickups =
                repository.countByDriverUserIdAndActionType(driverUserId, ActionType.PICKUP);

        long deliveries =
                repository.countByDriverUserIdAndActionType(driverUserId, ActionType.DELIVERY);

        return new DriverDashboardDto(pickups, deliveries);
    }
}
