package com.kindconnect.Profile_Service.Service;

import com.kindconnect.Profile_Service.DTO.*;
import com.kindconnect.Profile_Service.Exception.ProfileAlreadyExistsException;
import com.kindconnect.Profile_Service.Exception.ProfileNotFoundException;
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

    // DONOR
    public void createDonorProfile(DonorProfileRequest request) {
        if (donorRepo.findByUserId(request.getUserId()).isPresent()) {
            throw new ProfileAlreadyExistsException("Donor profile already exists");
        }

        DonorProfile donor = new DonorProfile();
        donor.setUserId(request.getUserId());
        donor.setName(request.getName());
        donor.setPhone(request.getPhone());
        donor.setAddress(request.getAddress());
        donor.setCity(request.getCity());

        donorRepo.save(donor);
    }

    // NGO
    public void createNgoProfile(NgoProfileRequest request) {
        if (ngoRepo.findByUserId(request.getUserId()).isPresent()) {
            throw new ProfileAlreadyExistsException("NGO profile already exists");
        }

        NgoProfile ngo = new NgoProfile();
        ngo.setUserId(request.getUserId());
        ngo.setNgoName(request.getNgoName());
        ngo.setPhone(request.getPhone());
        ngo.setAddress(request.getAddress());
        ngo.setCity(request.getCity());
        ngo.setStatus(NgoStatus.PENDING);
        ngo.setContactPerson(request.getContactperson());
        ngoRepo.save(ngo);
    }

    // DRIVER
    public void createDriverProfile(DriverProfileRequest request) {
        if (driverRepo.findByUserId(request.getUserId()).isPresent()) {
            throw new ProfileAlreadyExistsException("Driver profile already exists");
        }
        System.out.println("inside method");
        DriverProfile driver = new DriverProfile();
        driver.setUserId(request.getUserId());
        driver.setName(request.getName());
        driver.setPhone(request.getPhone());
        driver.setVehicleType(request.getVehicleType());
        driver.setVehicleNumber(request.getVehicleNumber());
        driver.setLicenseNumber(request.getLicenseNumber());
        driver.setAvailable(true);

        driverRepo.save(driver);
    }

    // DONOR
    public DonorProfile getDonorProfile(Long userId) {
        return donorRepo.findByUserId(userId)
                .orElseThrow(() ->
                        new ProfileNotFoundException("Donor profile not found"));
    }

    // NGO
    public NgoProfile getNgoProfile(Long userId) {
        return ngoRepo.findByUserId(userId)
                .orElseThrow(() ->
                        new ProfileNotFoundException("NGO profile not found"));
    }

    // DRIVER
    public DriverProfile getDriverProfile(Long userId) {
        return driverRepo.findByUserId(userId)
                .orElseThrow(() ->
                        new ProfileNotFoundException("Driver profile not found"));
    }

}
