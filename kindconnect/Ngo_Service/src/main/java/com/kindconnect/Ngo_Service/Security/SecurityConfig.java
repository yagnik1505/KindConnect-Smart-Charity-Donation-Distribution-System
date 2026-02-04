package com.kindconnect.Ngo_Service.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import lombok.RequiredArgsConstructor;


@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public fundraiser endpoints
                        .requestMatchers(HttpMethod.GET, "/ngo/fundraisers/active").permitAll()
                        .requestMatchers(HttpMethod.GET, "/ngo/fundraisers/featured").permitAll()
                        .requestMatchers(HttpMethod.GET, "/ngo/fundraisers/urgent").permitAll()
                        .requestMatchers(HttpMethod.GET, "/ngo/fundraisers/search").permitAll()
                        .requestMatchers(HttpMethod.GET, "/ngo/fundraisers/categories").permitAll()
                        .requestMatchers(HttpMethod.GET, "/ngo/fundraisers/category/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/ngo/fundraisers/{id}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/ngo/fundraisers/{id}/recent-donations").permitAll()
                        .requestMatchers(HttpMethod.GET, "/ngo/fundraisers/{id}/donations").permitAll()
                        // All other ngo endpoints require authentication
                        .requestMatchers("/ngo/**").authenticated()
                        .anyRequest().permitAll()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

}
