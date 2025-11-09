package com.tahtam.backend.dto;

import com.tahtam.backend.model.DayOfWeek;

import lombok.Data;

@Data
public class BatchRentalRequest {
    
    private String stallId;
    private String tenantId;
    private String marketplaceId;
    private Double price;

    private int year;
    private int month;
    private DayOfWeek dayOfWeek;

}
