package com.kindconnect.Driver_Service.Model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class DriverAction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long driverUserId;
    private Long donationId;

    @Enumerated(EnumType.STRING)
    private ActionType actionType;

    private LocalDateTime actionTime;
}
