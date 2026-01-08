package com.kindconnect.Donation_Service.Exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ================= AUTHENTICATION (401) =================
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<?> handleAuthenticationException(AuthenticationException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of(
                        "error", "Authentication required",
                        "message", "Please login to access this resource"
                ));
    }

    // ================= AUTHORIZATION (403) =================
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<?> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of(
                        "error", "Access denied",
                        "message", "You are not allowed to perform this action"
                ));
    }

    // ================= DONATION NOT FOUND (404) =================
    @ExceptionHandler(DonationNotFoundException.class)
    public ResponseEntity<?> handleDonationNotFound(DonationNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of(
                        "error", "Donation not found",
                        "message", ex.getMessage()
                ));
    }

    // ================= INVALID BUSINESS STATE (400) =================
    @ExceptionHandler(InvalidDonationStateException.class)
    public ResponseEntity<?> handleInvalidDonationState(InvalidDonationStateException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                        "error", "Invalid donation state",
                        "message", ex.getMessage()
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
                        "error", "Validation failed",
                        "fields", errors
                ));
    }

    // ================= FALLBACK (500) =================
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGenericException(Exception ex, HttpServletRequest request) {

        ex.printStackTrace(); // keep for logs

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                        "error", "Internal server error",
                        "message", "Something went wrong"
                ));
    }
}
