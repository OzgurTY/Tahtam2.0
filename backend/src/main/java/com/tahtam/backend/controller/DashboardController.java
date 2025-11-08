package com.tahtam.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tahtam.backend.dto.MarketDaySummary;
import com.tahtam.backend.model.DayOfWeek;
import com.tahtam.backend.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class DashboardController {
    
    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/market-summary")
    public ResponseEntity<MarketDaySummary> getMarketDaySummary(@RequestParam String marketplaceId, @RequestParam DayOfWeek dayOfWeek) {
        MarketDaySummary summary = dashboardService.getMarketDaySummary(marketplaceId, dayOfWeek);
        return new ResponseEntity<>(summary, HttpStatus.OK);
    }

}
