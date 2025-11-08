package com.tahtam.backend.service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tahtam.backend.dto.MarketDaySummary;
import com.tahtam.backend.model.Booking;
import com.tahtam.backend.model.DayOfWeek;
import com.tahtam.backend.model.Stall;
import com.tahtam.backend.repository.BookingRepository;
import com.tahtam.backend.repository.StallRepository;

@Service
public class DashboardService {
    
    @Autowired
    private StallRepository stallRepository;
    @Autowired
    private BookingRepository bookingRepository;

    public MarketDaySummary getMarketDaySummary(String marketplaceId, DayOfWeek dayOfWeek) {
        List<Stall> allStalls = stallRepository.findByMarketplaceId(marketplaceId);
        List<Booking> bookings = bookingRepository.findByMarketplaceIdAndDayOfWeek(marketplaceId, dayOfWeek);
        Set<String> bookedStallIds = bookings.stream().map(Booking::getStallId).collect(Collectors.toSet());
        List<Stall> availableStalls = allStalls.stream().filter(stall -> !bookedStallIds.contains(stall.getId())).collect(Collectors.toList());

        MarketDaySummary summary = new MarketDaySummary();
        summary.setTotalStalls(allStalls.size());
        summary.setBookedStallsCount(bookings.size());
        summary.setAvailableStallsCount(availableStalls.size());
        summary.setAvailableStalls(availableStalls);

        return summary;
    }

}
