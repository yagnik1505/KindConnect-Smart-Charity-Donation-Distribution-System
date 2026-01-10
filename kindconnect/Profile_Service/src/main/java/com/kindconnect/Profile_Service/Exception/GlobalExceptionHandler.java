package com.kindconnect.Profile_Service.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.http.converter.HttpMessageNotReadableException;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ================= PROFILE ALREADY EXISTS (409) =================
    @ExceptionHandler(ProfileAlreadyExistsException.class)
    public ResponseEntity<?> handleProfileAlreadyExists(ProfileAlreadyExistsException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of(
                        "error", "Profile already exists",
                        "message", ex.getMessage()
                ));
    }



    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<?> handleMissingRequestBody(HttpMessageNotReadableException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                Map.of(
                        "error", "Invalid request body",
                        "message", "Request body is missing or malformed JSON"
                )
        );
    }

    // ================= PROFILE NOT FOUND (404) =================
    @ExceptionHandler(ProfileNotFoundException.class)
    public ResponseEntity<?> handleProfileNotFound(ProfileNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of(
                        "error", "Profile not found",
                        "message", ex.getMessage()
                ));
    }

    // ================= AUTHENTICATION ERROR (401) =================
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<?> handleAuthentication(AuthenticationException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of(
                        "error", "Authentication required",
                        "message", "Please login to access this resource"
                ));
    }

    // ================= AUTHORIZATION ERROR (403) =================
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<?> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of(
                        "error", "Access denied",
                        "message", "You are not allowed to perform this action"
                ));
    }

    // ================= FALLBACK (500) =================
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGenericException(Exception ex) {
        ex.printStackTrace(); // IMPORTANT during development

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of(
                        "error", "Internal server error",
                        "message", "Unexpected error occurred. Please contact support."
                )
        );
    }


    // ================= VALIDATION ERRORS (400) =================

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationErrors(MethodArgumentNotValidException ex) {

        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> fieldErrors.put(error.getField(), error.getDefaultMessage()));

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                Map.of(
                        "error", "Validation failed",
                        "fields", fieldErrors
                )
        );
    }

}
