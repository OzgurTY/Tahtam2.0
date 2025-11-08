package com.tahtam.backend.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tahtam.backend.model.Rental;
import com.tahtam.backend.repository.RentalRepository;

@Service
public class RentalService {
    
    @Autowired
    private RentalRepository rentalRepository;

    public Rental createRental(Rental rental) {
        Optional<Rental> existingRental = rentalRepository.findByStallIdAndRentalDate(rental.getStallId(), rental.getRentalDate());
        if (existingRental.isPresent()) {
            throw new IllegalStateException("Bu tahta (" + rental.getStallId() + ") " + rental.getRentalDate() + " tarihi için dolu.");
        }
        return rentalRepository.save(rental);
    }

    public List<Rental> getRentalsByMarketplaceAndDate(String marketplaceId, LocalDate date) {
        return rentalRepository.findByMarketplaceIdAndRentalDate(marketplaceId, date);
    }

    public void deleteRental(String rentalId) {
        rentalRepository.deleteById(rentalId);
    }

    public List<Rental> getAllRentals() {
        return rentalRepository.findAll();
    }

}
