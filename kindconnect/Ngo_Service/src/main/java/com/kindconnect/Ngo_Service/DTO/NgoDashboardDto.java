package com.kindconnect.Ngo_Service.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class NgoDashboardDto {

    private Long totalAccepted;
    private Long activeDonations;
    private Long cancelledDonations;
}
