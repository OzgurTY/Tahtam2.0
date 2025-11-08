package com.tahtam.backend.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tahtam.backend.dto.MarketDaySummary;
import com.tahtam.backend.model.Marketplace;
import com.tahtam.backend.model.Rental;
import com.tahtam.backend.model.Stall;
import com.tahtam.backend.repository.MarketplaceRepository;
import com.tahtam.backend.repository.RentalRepository;
import com.tahtam.backend.repository.StallRepository;

@Service
public class DashboardService {
    
    @Autowired
    private StallRepository stallRepository;
    @Autowired
    private RentalRepository rentalRepository;
    @Autowired
    private MarketplaceRepository marketplaceRepository;

    public MarketDaySummary getMarketDaySummary(String marketplaceId, LocalDate date) {
        Marketplace marketplace = marketplaceRepository.findById(marketplaceId).orElseThrow(() -> new IllegalStateException("Pazaryeri bulunamadı."));

        java.time.DayOfWeek javaDay = date.getDayOfWeek();

        boolean isOpen = marketplace.getOpenDays() != null && marketplace.getOpenDays().stream().anyMatch(myDay -> myDay.name().equals(javaDay.name()));

        if (!isOpen) {
            throw new IllegalStateException("Pazaryeri seçilen tarihte (" + date + ") açık değil.");
        }

        List<Stall> allStalls = stallRepository.findByMarketplaceId(marketplaceId);
        List<Rental> rentals = rentalRepository.findByMarketplaceIdAndRentalDate(marketplaceId, date);
        Set<String> bookedStallIds = rentals.stream().map(Rental::getStallId).collect(Collectors.toSet());
        List<Stall> availableStalls = allStalls.stream().filter(stall -> !bookedStallIds.contains(stall.getId())).collect(Collectors.toList());

        MarketDaySummary summary = new MarketDaySummary();
        summary.setTotalStalls(allStalls.size());
        summary.setBookedStallsCount(rentals.size());
        summary.setAvailableStallsCount(availableStalls.size());
        summary.setAvailableStalls(availableStalls);

        return summary;
    }

}
