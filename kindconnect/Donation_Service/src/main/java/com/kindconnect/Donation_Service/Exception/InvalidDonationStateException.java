package com.kindconnect.Donation_Service.Exception;

public class InvalidDonationStateException extends RuntimeException {

    public InvalidDonationStateException(String message) {
        super(message);
    }
}
