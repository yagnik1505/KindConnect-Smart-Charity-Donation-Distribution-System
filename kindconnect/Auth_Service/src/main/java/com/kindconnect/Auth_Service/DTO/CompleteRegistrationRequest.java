package com.kindconnect.Auth_Service.DTO;

import com.kindconnect.Auth_Service.Model.Role;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CompleteRegistrationRequest {
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$",
            message = "Password must include uppercase, lowercase, number, and special character"
    )
    private String password;

    @NotNull(message = "Role is required")
    private Role role;

    @NotBlank(message = "OTP is required")
    private String otpCode;
}
