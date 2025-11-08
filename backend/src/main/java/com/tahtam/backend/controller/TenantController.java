package com.tahtam.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tahtam.backend.model.Tenant;
import com.tahtam.backend.service.TenantService;

@RestController
@RequestMapping("/api/tenants")
@CrossOrigin(origins = "http://localhost:3000")
public class TenantController {
    
    @Autowired
    private TenantService tenantService;

    @GetMapping
    public ResponseEntity<List<Tenant>> getAllTenants() {
        List<Tenant> tenants = tenantService.getAllTenants();
        return new ResponseEntity<>(tenants, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Tenant> createTenant(@RequestBody Tenant tenant) {
        Tenant newTenant = tenantService.createTenant(tenant);
        return new ResponseEntity<>(newTenant, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTenant(@PathVariable String id) {
        try {
            tenantService.deleteTenant(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
