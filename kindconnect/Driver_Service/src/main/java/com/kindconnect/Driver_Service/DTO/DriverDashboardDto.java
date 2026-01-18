package com.kindconnect.Driver_Service.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DriverDashboardDto {

    private long totalPickups;
    private long totalDeliveries;
}
