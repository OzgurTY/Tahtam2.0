package com.tahtam.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tahtam.backend.model.Stall;
import com.tahtam.backend.repository.RentalRepository;
import com.tahtam.backend.repository.StallRepository;

@Service
public class StallService {

    @Autowired
    private StallRepository stallRepository;
    @Autowired
    private RentalRepository rentalRepository;

    public Stall createStall(Stall stall) {
        return stallRepository.save(stall);
    }

    public List<Stall> getStallByMarketplace(String marketplaceId) {
        return stallRepository.findByMarketplaceId(marketplaceId);
    }

    public Stall updateStall(String stallId, Stall stallDetails) {
        Stall existingStall = stallRepository.findById(stallId).orElseThrow(() -> new IllegalStateException("Tahta bulunamadı: " + stallId));
        existingStall.setStallNumber(stallDetails.getStallNumber());
        existingStall.setProductTypes(stallDetails.getProductTypes());
        return stallRepository.save(existingStall);
    }

    public void deleteStall(String stallId) {
        rentalRepository.deleteByStallId(stallId);
        stallRepository.deleteById(stallId);
    }

}
