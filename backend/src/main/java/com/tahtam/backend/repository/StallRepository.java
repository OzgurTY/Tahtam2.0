package com.tahtam.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.tahtam.backend.model.Stall;

public interface StallRepository extends MongoRepository<Stall, String> {
    
    List<Stall> findByMarketplaceId(String marketplaceId);

}
