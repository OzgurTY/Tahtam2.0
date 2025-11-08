package com.tahtam.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.tahtam.backend.model.Booking;
import com.tahtam.backend.model.DayOfWeek;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    
    Optional<Booking> findByStallIdAndDayOfWeek(String stallId, DayOfWeek dayOfWeek);

    List<Booking> findByMarketplaceIdAndDayOfWeek(String marketplaceId, DayOfWeek dayOfWeek);

}
