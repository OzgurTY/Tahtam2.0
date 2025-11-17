package com.tahtam.backend.service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tahtam.backend.dto.BatchRentalRequest;
import com.tahtam.backend.model.PaymentStatus;
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

    public void deleteBatchRentals(List<String> rentalIds) {
        if (rentalIds == null || rentalIds.isEmpty()) {
            return;
        }
        rentalRepository.deleteByIdIn(rentalIds);
    }

    public List<Rental> getAllRentals() {
        return rentalRepository.findAll();
    }

    public List<Rental> createBatchRentals(BatchRentalRequest request) {
        List<Rental> createdRentals = new ArrayList<>();
        YearMonth yearMonth = YearMonth.of(request.getYear(), request.getMonth());
        int daysInMonth = yearMonth.lengthOfMonth();

        List<LocalDate> targetDates = new ArrayList<>();
        
        for (int day = 1; day <= daysInMonth; day++) {
            LocalDate date = yearMonth.atDay(day);
            boolean isTargetDay = request.getDaysOfWeek().stream()
                .anyMatch(d -> d.name().equals(date.getDayOfWeek().name()));
            
            if (isTargetDay) {
                targetDates.add(date);
            }
        }

        if (targetDates.isEmpty() || request.getStallIds().isEmpty()) {
            return createdRentals;
        }

        int totalSlots = request.getStallIds().size() * targetDates.size();
        Double pricePerSlot = request.getPrice() / totalSlots;

        for (String stallId : request.getStallIds()) {
            for (LocalDate date : targetDates) {
                
                Optional<Rental> existingRental = rentalRepository.findByStallIdAndRentalDate(stallId, date);
                if (existingRental.isPresent()) {
                    throw new IllegalStateException(
                        "Toplu işlem başarısız. Tahta (" + stallId + ") " + date + " tarihinde zaten dolu."
                    );
                }

                Rental newRental = new Rental();
                newRental.setStallId(stallId);
                newRental.setTenantId(request.getTenantId());
                newRental.setMarketplaceId(request.getMarketplaceId());
                newRental.setPrice(pricePerSlot);
                newRental.setRentalDate(date);
                
                createdRentals.add(newRental);
            }
        }

        return rentalRepository.saveAll(createdRentals);
    }

    public Rental updatePaymentStatus(String rentalId, PaymentStatus newStatus) {
        Rental rental = rentalRepository.findById(rentalId).orElseThrow(() -> new IllegalStateException("Kiralama kaydı bulunamadı: " + rentalId));
        rental.setStatus(newStatus);
        return rentalRepository.save(rental);
    }

}
