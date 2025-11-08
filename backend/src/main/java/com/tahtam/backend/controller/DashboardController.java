package com.tahtam.backend.controller;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tahtam.backend.dto.IncomeReportDto;
import com.tahtam.backend.dto.MarketDaySummary;
import com.tahtam.backend.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/market-summary")
    public ResponseEntity<?> getMarketDaySummary(
            @RequestParam String marketplaceId,
            @RequestParam String date) {

        try {
            LocalDate rentalDate = LocalDate.parse(date);
            MarketDaySummary summary = dashboardService.getMarketDaySummary(marketplaceId, rentalDate);
            return new ResponseEntity<>(summary, HttpStatus.OK);
        } catch (IllegalStateException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/income-report")
    public ResponseEntity<IncomeReportDto> getIncomeRepor(@RequestParam String startDate, @RequestParam String endDate) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);

        IncomeReportDto report = dashboardService.getIncomeReport(start, end);
        return new ResponseEntity<>(report, HttpStatus.OK);
    }
}