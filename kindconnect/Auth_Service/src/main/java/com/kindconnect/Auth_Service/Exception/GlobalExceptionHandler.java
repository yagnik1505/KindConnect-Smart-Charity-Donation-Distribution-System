package com.kindconnect.Auth_Service.Exception;


import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import com.fasterxml.jackson.databind.exc.InvalidFormatException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<?> handleUserExists(UserAlreadyExistsException ex) {
        return ResponseEntity.status(409).body(Map.of("Error", ex.getMessage()));
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<?> handleUserNotFound(UserNotFoundException ex) {
        return ResponseEntity.status(404)
                .body(Map.of("Error", ex.getMessage()));
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<?> handleInvalidCredentials(InvalidCredentialsException ex) {
        return ResponseEntity.status(401)
                .body(Map.of("Error", ex.getMessage()));
    }

    @ExceptionHandler(InvalidOtpException.class)
    public ResponseEntity<?> handleInvalidOtp(InvalidOtpException ex) {
        return ResponseEntity.status(400)
                .body(Map.of("Error", ex.getMessage()));
    }

    @ExceptionHandler(OtpNotFoundException.class)
    public ResponseEntity<?> handleOtpNotFound(OtpNotFoundException ex) {
        return ResponseEntity.status(404)
                .body(Map.of("Error", ex.getMessage()));
    }

    @ExceptionHandler(OtpNotVerifiedException.class)
    public ResponseEntity<?> handleOtpNotVerified(OtpNotVerifiedException ex) {
        return ResponseEntity.status(400)
                .body(Map.of("Error", ex.getMessage()));
    }

    @ExceptionHandler(OtpExpiredException.class)
    public ResponseEntity<?> handleOtpExpired(OtpExpiredException ex) {
        return ResponseEntity.status(410)
                .body(Map.of("Error", ex.getMessage()));
    }

    // Validation errors (empty email, password, etc.)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(err ->
                        errors.put(err.getField(), err.getDefaultMessage()));
        return ResponseEntity.badRequest().body(errors);
    }

    // INVALID ENUM (WRONG ROLE)
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<?> handleInvalidEnum(HttpMessageNotReadableException ex) {

        if (ex.getCause() instanceof InvalidFormatException) {
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "Error",
                            "Invalid role. Allowed values: DONOR, NGO, DRIVER, ADMIN"
                    )
            );
        }

        return ResponseEntity.badRequest().body(
                Map.of("Error", "Invalid request body")
        );
    }

}

