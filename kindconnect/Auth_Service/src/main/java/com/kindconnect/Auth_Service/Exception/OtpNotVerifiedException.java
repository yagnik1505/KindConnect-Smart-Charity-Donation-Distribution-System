package com.kindconnect.Auth_Service.Exception;

public class OtpNotVerifiedException extends RuntimeException {
    public OtpNotVerifiedException(String message) {
        super(message);
    }
}
