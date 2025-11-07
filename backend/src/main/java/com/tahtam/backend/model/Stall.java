package com.tahtam.backend.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "stalls")
@Data
public class Stall {
    
    @Id
    private String id;
    private String stallNumber;
    private String marketplaceId;
    private List<String> productTypes;
    private StallStatus status;

    public Stall() {
        this.status = StallStatus.AVAILABLE;
    }

}
