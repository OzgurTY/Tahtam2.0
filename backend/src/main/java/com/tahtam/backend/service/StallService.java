package com.tahtam.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tahtam.backend.model.Stall;
import com.tahtam.backend.repository.StallRepository;

@Service
public class StallService {

    @Autowired
    private StallRepository stallRepository;

    public Stall createStall(Stall stall) {
        return stallRepository.save(stall);
    }

    public List<Stall> getStallByMarketplace(String marketplaceId) {
        return stallRepository.findByMarketplaceId(marketplaceId);
    }

}
