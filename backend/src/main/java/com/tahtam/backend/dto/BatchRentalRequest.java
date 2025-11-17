package com.tahtam.backend.dto;

import java.util.List;

import com.tahtam.backend.model.DayOfWeek;

import lombok.Data;

@Data
public class BatchRentalRequest {
    
    private List<String> stallIds;
    private String tenantId;
    private String marketplaceId;
    private Double price;

    private int year;
    private int month;
    private List<DayOfWeek> daysOfWeek;

}
