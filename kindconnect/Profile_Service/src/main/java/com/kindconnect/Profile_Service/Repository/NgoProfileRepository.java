package com.kindconnect.Profile_Service.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kindconnect.Profile_Service.Model.NgoProfile;
import com.kindconnect.Profile_Service.Model.NgoStatus;

@Repository
public interface NgoProfileRepository extends JpaRepository<NgoProfile, Long> {

    Optional<NgoProfile> findByUserId(Long userId);
    
    List<NgoProfile> findByStatus(NgoStatus status);
    
    List<NgoProfile> findByCityIgnoreCase(String city);
    
    List<NgoProfile> findByStatusAndCityIgnoreCase(NgoStatus status, String city);
}
