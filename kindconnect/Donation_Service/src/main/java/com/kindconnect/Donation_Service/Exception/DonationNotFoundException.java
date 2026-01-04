package com.kindconnect.Donation_Service.Exception;


public class DonationNotFoundException extends RuntimeException {
    public DonationNotFoundException(String message) {
        super(message);
    }
}
