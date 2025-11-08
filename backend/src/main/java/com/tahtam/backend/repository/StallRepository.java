package com.tahtam.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.tahtam.backend.model.Stall;

@Repository
public interface StallRepository extends MongoRepository<Stall, String> {
    
    List<Stall> findByMarketplaceId(String marketplaceId);

    void deleteByMarketplaceId(String marketplaceId);

}
