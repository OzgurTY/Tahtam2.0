package com.tahtam.backend.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tahtam.backend.dto.BatchRentalRequest;
import com.tahtam.backend.model.PaymentStatus;
import com.tahtam.backend.model.Rental;
import com.tahtam.backend.service.RentalService;

@RestController
@RequestMapping("/api/rentals")
@CrossOrigin(origins = "http://localhost:3000")
public class RentalController {
    
    @Autowired
    private RentalService rentalService;

    @PostMapping
    public ResponseEntity<?> createRental(@RequestBody Rental rental) {
        try {
            Rental newRental = rentalService.createRental(rental);
            return new ResponseEntity<>(newRental, HttpStatus.CREATED);
        } catch (IllegalStateException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @PostMapping("/batch")
    public ResponseEntity<?> createBatchRentals(@RequestBody BatchRentalRequest request) {
        try {
            List<Rental> newRentals = rentalService.createBatchRentals(request);
            return new ResponseEntity<>(newRentals, HttpStatus.OK);
        } catch (IllegalStateException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @GetMapping
    public ResponseEntity<List<Rental>> getRentals(@RequestParam String marketplaceId, @RequestParam String date) {
        LocalDate rentalDate = LocalDate.parse(date);
        List<Rental> rentals = rentalService.getRentalsByMarketplaceAndDate(marketplaceId, rentalDate);
        return new ResponseEntity<>(rentals, HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Rental>> getAllRentals() {
        List<Rental> rentals = rentalService.getAllRentals();
        return new ResponseEntity<>(rentals, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRental(@PathVariable String id) {
        rentalService.deleteRental(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/batch")
    public ResponseEntity<Void> deleteBatchRentals(@RequestBody List<String> rentalIds) {
        try {
            rentalService.deleteBatchRentals(rentalIds);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        try {
            String statusString = body.get("status");
            PaymentStatus newStatus = PaymentStatus.valueOf(statusString.toUpperCase());
            Rental updatedRental = rentalService.updatePaymentStatus(id, newStatus);
            return new ResponseEntity<>(updatedRental, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("Geçersiz durum: " + body.get("status"), HttpStatus.BAD_REQUEST);
        } catch (IllegalStateException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

}
