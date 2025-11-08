package com.tahtam.backend.model;

import java.time.LocalDate;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "rentals")
@Data
public class Rental {
    
    @Id
    private String id;
    private String stallId;
    private String tenantId;
    private String marketplaceId;

    private LocalDate rentalDate;

    private Double price;

}
