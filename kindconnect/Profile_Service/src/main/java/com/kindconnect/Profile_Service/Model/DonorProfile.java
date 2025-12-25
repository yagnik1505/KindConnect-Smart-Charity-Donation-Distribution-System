    package com.kindconnect.Profile_Service.Model;

    import jakarta.persistence.Entity;
    import jakarta.persistence.GeneratedValue;
    import jakarta.persistence.GenerationType;
    import jakarta.persistence.Id;
    import lombok.Data;

    @Data
    @Entity
    public class DonorProfile {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private Long userId;

        private String name;
        private String phone;
        private String address;
        private String city;

    }
