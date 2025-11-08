package com.tahtam.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tahtam.backend.model.Marketplace;
import com.tahtam.backend.repository.MarketplaceRepository;
import com.tahtam.backend.repository.RentalRepository;
import com.tahtam.backend.repository.StallRepository;

@Service
public class MarketplaceService {
    
    @Autowired
    private MarketplaceRepository marketplaceRepository;
    @Autowired
    private StallRepository stallRepository;
    @Autowired
    private RentalRepository rentalRepository;

    public List<Marketplace> getAlMarketplaces() {
        return marketplaceRepository.findAll();
    }

    public Marketplace createMarketplace(Marketplace marketplace) {
        return marketplaceRepository.save(marketplace);
    }

    public Marketplace updateMarketplace(String marketplaceId, Marketplace marketplaceDetails) {
        Marketplace existingMarketplace = marketplaceRepository.findById(marketplaceId).orElseThrow(() -> new IllegalStateException("Pazaryeri bulunamadı: " + marketplaceId));
        existingMarketplace.setName(marketplaceDetails.getName());
        existingMarketplace.setAddress(marketplaceDetails.getAddress());
        existingMarketplace.setOpenDays(marketplaceDetails.getOpenDays());
        return marketplaceRepository.save(existingMarketplace);
    }

    public void deleteMarketplace(String marketplaceId) {
        rentalRepository.deleteByMarketplaceId(marketplaceId);
        stallRepository.deleteByMarketplaceId(marketplaceId);
        marketplaceRepository.deleteById(marketplaceId);
    }

}
