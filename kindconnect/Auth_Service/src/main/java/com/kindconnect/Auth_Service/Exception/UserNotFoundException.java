package com.kindconnect.Auth_Service.Exception;


public class UserNotFoundException extends RuntimeException  {
    public UserNotFoundException(String message) {
        super(message);
    }
}
