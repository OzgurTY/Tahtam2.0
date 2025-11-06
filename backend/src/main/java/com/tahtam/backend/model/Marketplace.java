package com.tahtam.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "marketplaces")
@Data
public class Marketplace {
    
    @Id
    private String id;
    private String name;
    private String address;

}
