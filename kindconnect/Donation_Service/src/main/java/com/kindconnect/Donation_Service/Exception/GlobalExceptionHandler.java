package com.kindconnect.Donation_Service.Exception;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    private static final String MESSAGE_KEY = "message";
    private static final String ERROR_KEY = "error";

    // ================= AUTHENTICATION (401) =================
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<?> handleAuthenticationException(AuthenticationException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of(
                        ERROR_KEY, "Authentication required",
                        MESSAGE_KEY, "Please login to access this resource"
                ));
    }

    // ================= AUTHORIZATION (403) =================
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<?> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of(
                        ERROR_KEY, "Access denied",
                        MESSAGE_KEY, "You are not allowed to perform this action"
                ));
    }

    // ================= DONATION NOT FOUND (404) =================
    @ExceptionHandler(DonationNotFoundException.class)
    public ResponseEntity<?> handleDonationNotFound(DonationNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of(
                        ERROR_KEY, "Donation not found",
                        MESSAGE_KEY, ex.getMessage()
                ));
    }

    // ================= INVALID BUSINESS STATE (400) =================
    @ExceptionHandler(InvalidDonationStateException.class)
    public ResponseEntity<?> handleInvalidDonationState(InvalidDonationStateException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                        ERROR_KEY, "Invalid donation state",
                        MESSAGE_KEY, ex.getMessage()
                ));
    }

    // ================= VALIDATION ERRORS (400) =================
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationErrors(MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult()
                .getFieldErrors()
                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                        ERROR_KEY, "Validation failed",
                        "fields", errors
                ));
    }

    // ================= FALLBACK (500) =================
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGenericException(Exception ex, HttpServletRequest request) {

        logger.error("Unexpected error occurred", ex);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                        ERROR_KEY, "Internal server error",
                        MESSAGE_KEY, "Something went wrong"
                ));
    }
}
