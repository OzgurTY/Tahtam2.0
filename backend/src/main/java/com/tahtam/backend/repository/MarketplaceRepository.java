package com.tahtam.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.tahtam.backend.model.Marketplace;

@Repository
public interface  MarketplaceRepository extends MongoRepository<Marketplace, String> {
    
}
