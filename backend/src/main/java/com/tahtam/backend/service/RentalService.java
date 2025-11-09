package com.tahtam.backend.service;

import java.time.DayOfWeek;
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
        DayOfWeek targetDay = DayOfWeek.valueOf(request.getDayOfWeek().name());
        YearMonth yearMonth = YearMonth.of(request.getYear(), request.getMonth());
        int daysInMonth = yearMonth.lengthOfMonth();

        for (int day = 1; day <= daysInMonth; day++) {
            LocalDate date = yearMonth.atDay(day);
            if (date.getDayOfWeek() == targetDay) {
                Optional<Rental> existingRental = rentalRepository.findByStallIdAndRentalDate(request.getStallId(), date);
                if (existingRental.isPresent()) {
                    throw new IllegalStateException("Toplu kiralama başarısız. " + date + " tarihi zaten dolu.");
                }
                Rental newRental = new Rental();
                newRental.setStallId(request.getStallId());
                newRental.setTenantId(request.getTenantId());
                newRental.setMarketplaceId(request.getMarketplaceId());
                newRental.setPrice(request.getPrice());
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
