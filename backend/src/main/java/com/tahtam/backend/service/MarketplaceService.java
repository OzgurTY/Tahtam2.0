package com.tahtam.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tahtam.backend.model.Marketplace;
import com.tahtam.backend.repository.MarketplaceRepository;

@Service
public class MarketplaceService {
    
    @Autowired
    private MarketplaceRepository marketplaceRepository;

    public List<Marketplace> getAlMarketplaces() {
        return marketplaceRepository.findAll();
    }

    public Marketplace createMarketplace(Marketplace marketplace) {
        return marketplaceRepository.save(marketplace);
    }

}
