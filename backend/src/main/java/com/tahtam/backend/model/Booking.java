package com.tahtam.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "bookings")
@Data
public class Booking {
    
    @Id
    private String id;
    private String stallId;
    private String tenantId;
    private String marketplaceId;

    private DayOfWeek dayOfWeek;

    private Double price;

}
