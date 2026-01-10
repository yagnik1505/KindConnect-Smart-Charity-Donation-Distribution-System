package com.kindconnect.Profile_Service.Exception;

public class ProfileAlreadyExistsException extends RuntimeException {

    public ProfileAlreadyExistsException(String message) {
        super(message);
    }
}
