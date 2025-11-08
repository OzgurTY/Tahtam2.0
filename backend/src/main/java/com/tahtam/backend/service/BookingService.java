package com.tahtam.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tahtam.backend.model.Booking;
import com.tahtam.backend.model.DayOfWeek;
import com.tahtam.backend.repository.BookingRepository;

@Service
public class BookingService {
    
    @Autowired
    private BookingRepository bookingRepository;

    public Booking createBooking(Booking booking) {
        Optional<Booking> existingBooking = bookingRepository.findByStallIdAndDayOfWeek(booking.getStallId(), booking.getDayOfWeek());
        if (existingBooking.isPresent()) {
            throw new IllegalStateException("Bu tahta (" + booking.getStallId() + ") " + booking.getDayOfWeek() + " günü için dolu.");
        }
        return bookingRepository.save(booking);
    }

    public List<Booking> getBookingByMarketplaceAndDay(String marketplaceId, DayOfWeek dayOfWeek) {
        return bookingRepository.findByMarketplaceIdAndDayOfWeek(marketplaceId, dayOfWeek);
    }

    public void deleteBooking(String bookingId) {
        bookingRepository.deleteById(bookingId);
    }

}
