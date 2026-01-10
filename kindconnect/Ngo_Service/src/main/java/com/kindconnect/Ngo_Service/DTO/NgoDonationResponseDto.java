package com.kindconnect.Ngo_Service.DTO;

import com.kindconnect.Ngo_Service.Model.NgoDonationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NgoDonationResponseDto {

    private Long donationId;
    private NgoDonationStatus status;
    private LocalDateTime acceptedAt;
}


