package com.kindconnect.Profile_Service.Model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class NgoProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String ngoName;
    private String contactPerson;
    private String phone;
    private String address;
    private String city;

    @Enumerated(EnumType.STRING)
    private NgoStatus status;
}
