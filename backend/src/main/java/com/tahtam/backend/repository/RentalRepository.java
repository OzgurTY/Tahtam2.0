package com.tahtam.backend.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.tahtam.backend.model.Rental;

@Repository
public interface RentalRepository extends MongoRepository<Rental, String> {
    
    Optional<Rental> findByStallIdAndRentalDate(String stallId, LocalDate rentalDate);

    List<Rental> findByMarketplaceIdAndRentalDate(String marketplaceId, LocalDate rentalDate);

    void deleteByTenantId(String tenantId);

    void deleteByMarketplaceId(String marketplaceId);

    void deleteByStallId(String stallId);

}
