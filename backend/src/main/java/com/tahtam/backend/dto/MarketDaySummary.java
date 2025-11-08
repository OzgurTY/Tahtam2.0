package com.tahtam.backend.dto;

import java.util.List;

import com.tahtam.backend.model.Stall;

import lombok.Data;

@Data
public class MarketDaySummary {
    
    private int totalStalls;
    private int bookedStallsCount;
    private int availableStallsCount;
    private List<Stall> availableStalls;

}
