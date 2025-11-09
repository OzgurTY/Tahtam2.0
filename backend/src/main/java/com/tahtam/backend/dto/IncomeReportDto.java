package com.tahtam.backend.dto;

import lombok.Data;

@Data
public class IncomeReportDto {
    
    private double totalExpectedIncome;
    private double totalCollectedIncome;
    private long totalRentals;

}