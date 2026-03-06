package com.kindconnect.Profile_Service.Service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.kindconnect.Profile_Service.DTO.DonorProfileRequest;
import com.kindconnect.Profile_Service.DTO.DriverProfileRequest;
import com.kindconnect.Profile_Service.DTO.NgoProfileRequest;
import com.kindconnect.Profile_Service.Exception.ProfileAlreadyExistsException;
import com.kindconnect.Profile_Service.Exception.ProfileNotFoundException;
import com.kindconnect.Profile_Service.Model.DonorProfile;
import com.kindconnect.Profile_Service.Model.DriverProfile;
import com.kindconnect.Profile_Service.Model.NgoProfile;
import com.kindconnect.Profile_Service.Model.NgoStatus;
import com.kindconnect.Profile_Service.Repository.DonorProfileRepository;
import com.kindconnect.Profile_Service.Repository.DriverProfileRepository;
import com.kindconnect.Profile_Service.Repository.NgoProfileRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private static final String DRIVER_PROFILE_NOT_FOUND = "Driver profile not found";

    private final DonorProfileRepository donorRepo;
    private final NgoProfileRepository ngoRepo;
    private final DriverProfileRepository driverRepo;
    private final RestTemplate restTemplate;

    // ================= DONOR =================
    public void createDonorProfile(Long userId, DonorProfileRequest request) {

        if (donorRepo.findByUserId(userId).isPresent()) {
            throw new ProfileAlreadyExistsException("Donor profile already exists");
        }

        DonorProfile donor = new DonorProfile();
        donor.setUserId(userId);
        donor.setName(request.getName());
        donor.setPhone(request.getPhone());
        donor.setAddress(request.getAddress());
        donor.setCity(request.getCity());

        donorRepo.save(donor);
    }

    public DonorProfile getDonorProfile(Long userId) {
        return donorRepo.findByUserId(userId)
                .orElseThrow(() ->
                        new ProfileNotFoundException("Donor profile not found"));
    }

    public DonorProfile updateDonorProfile(Long userId, DonorProfileRequest request) {
        DonorProfile donor = donorRepo.findByUserId(userId)
                .orElseThrow(() ->
                        new ProfileNotFoundException("Donor profile not found"));

        donor.setName(request.getName());
        donor.setPhone(request.getPhone());
        donor.setAddress(request.getAddress());
        donor.setCity(request.getCity());

        return donorRepo.save(donor);
    }

    // ================= NGO =================
    public void createNgoProfile(Long userId, NgoProfileRequest request) {

        if (ngoRepo.findByUserId(userId).isPresent()) {
            throw new ProfileAlreadyExistsException("NGO profile already exists");
        }

        NgoProfile ngo = new NgoProfile();
        ngo.setUserId(userId);
        ngo.setNgoName(request.getNgoName());
        ngo.setContactPerson(request.getContactperson());
        ngo.setPhone(request.getPhone());
        ngo.setAddress(request.getAddress());
        ngo.setCity(request.getCity());
        ngo.setFieldType(request.getFieldType());
        ngo.setDescription(request.getDescription());
        ngo.setLogo(request.getLogo());
        ngo.setUpiId(request.getUpiId());
        ngo.setBankAccountNumber(request.getBankAccountNumber());
        ngo.setIfscCode(request.getIfscCode());
        ngo.setBankName(request.getBankName());
        ngo.setStatus(NgoStatus.PENDING);

        ngoRepo.save(ngo);
    }

    public NgoProfile getNgoProfile(Long userId) {
        return ngoRepo.findByUserId(userId)
                .orElseThrow(() ->
                        new ProfileNotFoundException("NGO profile not found"));
    }

    public NgoProfile updateNgoProfile(Long userId, NgoProfileRequest request) {
        NgoProfile ngo = ngoRepo.findByUserId(userId)
                .orElseThrow(() ->
                        new ProfileNotFoundException("NGO profile not found"));

        ngo.setNgoName(request.getNgoName());
        ngo.setContactPerson(request.getContactperson());
        ngo.setPhone(request.getPhone());
        ngo.setAddress(request.getAddress());
        ngo.setCity(request.getCity());
        ngo.setFieldType(request.getFieldType());
        ngo.setDescription(request.getDescription());
        if (request.getLogo() != null && !request.getLogo().isEmpty()) {
            ngo.setLogo(request.getLogo());
        }
        ngo.setUpiId(request.getUpiId());
        ngo.setBankAccountNumber(request.getBankAccountNumber());
        ngo.setIfscCode(request.getIfscCode());
        ngo.setBankName(request.getBankName());

        return ngoRepo.save(ngo);
    }
    
    // Get all approved NGOs (for donors to browse)
    public List<NgoProfile> getAllApprovedNgos() {
        List<NgoProfile> ngos = ngoRepo.findByStatus(NgoStatus.APPROVED);
        return enrichNgosWithStats(ngos);
    }
    
    // Get all NGOs (for admin)
    public List<NgoProfile> getAllNgos() {
        List<NgoProfile> ngos = ngoRepo.findAll();
        return enrichNgosWithStats(ngos);
    }
    
    // Get NGOs by city
    public List<NgoProfile> getNgosByCity(String city) {
        List<NgoProfile> ngos = ngoRepo.findByStatusAndCityIgnoreCase(NgoStatus.APPROVED, city);
        return enrichNgosWithStats(ngos);
    }
    
    // Get NGO by profile ID
    public NgoProfile getNgoById(Long id) {
        NgoProfile ngo = ngoRepo.findById(id)
                .orElseThrow(() ->
                        new ProfileNotFoundException("NGO profile not found"));
        return enrichNgoWithStats(ngo);
    }
    
    // Enrich single NGO with statistics
    private NgoProfile enrichNgoWithStats(NgoProfile ngo) {
        try {
            // Call Ngo_Service to get donation statistics
            // For now using placeholder values - will be replaced with actual service call
            @SuppressWarnings("unchecked")
            java.util.Map<String, Object> response = restTemplate.getForObject(
                "http://NGO-SERVICE/ngo/stats/" + ngo.getUserId(), 
                java.util.Map.class
            );
            
            if (response != null && response.containsKey("data")) {
                @SuppressWarnings("unchecked")
                java.util.Map<String, Object> data = (java.util.Map<String, Object>) response.get("data");
                ngo.setDonationsCount((Integer) data.getOrDefault("donationsCount", 0));
                ngo.setBeneficiaries((Integer) data.getOrDefault("beneficiaries", 0));
                ngo.setTotalDonationsReceived(((Number) data.getOrDefault("totalReceived", 0L)).longValue());
                ngo.setResponseTime((String) data.getOrDefault("responseTime", "N/A"));
            }
        } catch (Exception e) {
            // If service call fails, set default values
            ngo.setDonationsCount(0);
            ngo.setBeneficiaries(0);
            ngo.setTotalDonationsReceived(0L);
            ngo.setResponseTime("N/A");
        }
        return ngo;
    }
    
    // Enrich multiple NGOs with statistics
    private List<NgoProfile> enrichNgosWithStats(List<NgoProfile> ngos) {
        return ngos.stream()
                .map(this::enrichNgoWithStats)
                .toList();
    }

    // ================= DRIVER =================
    public void createDriverProfile(Long userId, DriverProfileRequest request) {

        if (driverRepo.findByUserId(userId).isPresent()) {
            throw new ProfileAlreadyExistsException("Driver profile already exists");
        }

        DriverProfile driver = new DriverProfile();
        driver.setUserId(userId);
        driver.setName(request.getName());
        driver.setPhone(request.getPhone());
        driver.setVehicleType(request.getVehicleType());
        driver.setVehicleNumber(request.getVehicleNumber());
        driver.setLicenseNumber(request.getLicenseNumber());
        driver.setAvailable(true);

        driverRepo.save(driver);
    }

    public DriverProfile getDriverProfile(Long userId) {
        return driverRepo.findByUserId(userId)
                .orElseThrow(() ->
                        new ProfileNotFoundException(DRIVER_PROFILE_NOT_FOUND));
    }

    public DriverProfile updateDriverProfile(Long userId, DriverProfileRequest request) {
        DriverProfile driver = driverRepo.findByUserId(userId)
                .orElseThrow(() ->
                        new ProfileNotFoundException(DRIVER_PROFILE_NOT_FOUND));

        driver.setName(request.getName());
        driver.setPhone(request.getPhone());
        driver.setVehicleType(request.getVehicleType());
        driver.setVehicleNumber(request.getVehicleNumber());
        driver.setLicenseNumber(request.getLicenseNumber());

        return driverRepo.save(driver);
    }

    public void updateDriverAvailability(Long aLong, boolean available) {
        DriverProfile driver = driverRepo.findByUserId(aLong)
                .orElseThrow(() ->
                        new ProfileNotFoundException(DRIVER_PROFILE_NOT_FOUND)
                );

        driver.setAvailable(available);
        driverRepo.save(driver);
    }

    // ================= ADMIN =================
    // Get all drivers (for admin dashboard)
    public List<DriverProfile> getAllDrivers() {
        return driverRepo.findAll();
    }

    // Toggle driver availability (admin only)
    public void adminToggleDriverAvailability(Long driverId, boolean available) {
        DriverProfile driver = driverRepo.findById(driverId)
                .orElseThrow(() -> new ProfileNotFoundException(DRIVER_PROFILE_NOT_FOUND));
        driver.setAvailable(available);
        driverRepo.save(driver);
    }

    // Update driver rating (admin only)
    public void updateDriverRating(Long driverId, Integer rating) {
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        DriverProfile driver = driverRepo.findById(driverId)
                .orElseThrow(() -> new ProfileNotFoundException(DRIVER_PROFILE_NOT_FOUND));
        driver.setRating(rating);
        driverRepo.save(driver);
    }

    // Get all NGOs including pending/rejected (for admin dashboard)
    public List<NgoProfile> getAllNgosIncludingPending() {
        List<NgoProfile> ngos = ngoRepo.findAll();
        return enrichNgosWithStats(ngos);
    }
    
    // Update NGO status (admin only)
    public void updateNgoStatus(Long ngoId, String status) {
        NgoProfile ngo = ngoRepo.findById(ngoId)
                .orElseThrow(() -> new ProfileNotFoundException("NGO profile not found"));
        
        try {
            NgoStatus ngoStatus = NgoStatus.valueOf(status.toUpperCase());
            ngo.setStatus(ngoStatus);
            ngoRepo.save(ngo);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status. Must be: PENDING, APPROVED, or REJECTED");
        }
    }
    
    // Update NGO rating (admin only)
    public void updateNgoRating(Long ngoId, Integer rating) {
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        
        NgoProfile ngo = ngoRepo.findById(ngoId)
                .orElseThrow(() -> new ProfileNotFoundException("NGO profile not found"));
        
        ngo.setRating(rating);
        ngoRepo.save(ngo);
    }

}
