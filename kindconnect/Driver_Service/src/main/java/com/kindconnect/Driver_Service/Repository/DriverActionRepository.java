package com.kindconnect.Driver_Service.Repository;

import com.kindconnect.Driver_Service.Model.ActionType;
import com.kindconnect.Driver_Service.Model.DriverAction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DriverActionRepository extends JpaRepository<DriverAction, Long> {

    long countByDriverUserIdAndActionType(Long driverUserId, ActionType actionType);
}
