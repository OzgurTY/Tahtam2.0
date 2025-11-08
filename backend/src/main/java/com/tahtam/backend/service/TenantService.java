package com.tahtam.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tahtam.backend.model.Tenant;
import com.tahtam.backend.repository.RentalRepository;
import com.tahtam.backend.repository.TenantRepository;

@Service
public class TenantService {
    
    @Autowired
    private TenantRepository tenantRepository;
    @Autowired
    private RentalRepository rentalRepository;

    public List<Tenant> getAllTenants() {
        return tenantRepository.findAll();
    }

    public Tenant createTenant(Tenant tenant) {
        return tenantRepository.save(tenant);
    }

    public void deleteTenant(String tenantId) {
        rentalRepository.deleteByTenantId(tenantId);
        tenantRepository.deleteById(tenantId);
    }

}
