package com.tahtam.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tahtam.backend.model.Marketplace;
import com.tahtam.backend.service.MarketplaceService;


@RestController
@RequestMapping("/api/marketplaces")
@CrossOrigin(origins = "http://localhost:3000")
public class MarketplaceController {
    
    @Autowired
    private MarketplaceService marketplaceService;

    @GetMapping
    public ResponseEntity<List<Marketplace>> getAllMarketplaces() {
        List<Marketplace> marketplaces = marketplaceService.getAlMarketplaces();
        return new ResponseEntity<>(marketplaces, HttpStatus.OK);
    }
    
    @PostMapping
    public ResponseEntity<Marketplace> createMarketplace(@RequestBody Marketplace marketplace) {
        Marketplace newMarketplace = marketplaceService.createMarketplace(marketplace);
        return new ResponseEntity<>(newMarketplace, HttpStatus.CREATED);
    }

}
