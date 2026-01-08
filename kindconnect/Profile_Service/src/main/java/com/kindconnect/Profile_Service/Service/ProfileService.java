package com.kindconnect.Profile_Service.Service;

import com.kindconnect.Profile_Service.DTO.*;
import com.kindconnect.Profile_Service.Exception.*;
import com.kindconnect.Profile_Service.Model.*;
import com.kindconnect.Profile_Service.Repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final DonorProfileRepository donorRepo;
    private final NgoProfileRepository ngoRepo;
    private final DriverProfileRepository driverRepo;

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
        ngo.setStatus(NgoStatus.PENDING);

        ngoRepo.save(ngo);
    }

    public NgoProfile getNgoProfile(Long userId) {
        return ngoRepo.findByUserId(userId)
                .orElseThrow(() ->
                        new ProfileNotFoundException("NGO profile not found"));
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
                        new ProfileNotFoundException("Driver profile not found"));
    }

    public void updateDriverAvailability(Long aLong, boolean available) {
        DriverProfile driver = driverRepo.findByUserId(aLong)
                .orElseThrow(() ->
                        new ProfileNotFoundException("Driver profile not found")
                );

        driver.setAvailable(available);
        driverRepo.save(driver);
    }

}
