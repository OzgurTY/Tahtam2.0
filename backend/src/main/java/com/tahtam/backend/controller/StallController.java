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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tahtam.backend.model.Stall;
import com.tahtam.backend.service.StallService;

@RestController
@RequestMapping("/api/stalls")
@CrossOrigin(origins = "http://localhost:3000")
public class StallController {
    
    @Autowired
    private StallService stallService;

    @PostMapping
    public ResponseEntity<Stall> createStall(@RequestBody Stall stall) {
        Stall newStall = stallService.createStall(stall);
        return new ResponseEntity<>(newStall, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Stall>> getStallsByMarketplace(@RequestParam String marketplaceId) {
        List<Stall> stalls = stallService.getStallByMarketplace(marketplaceId);
        return new ResponseEntity<>(stalls, HttpStatus.OK);
    }

}
