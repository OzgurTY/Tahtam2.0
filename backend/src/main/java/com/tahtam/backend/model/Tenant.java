package com.tahtam.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "tenants")
@Data
public class Tenant {
    
    @Id
    private String id;
    private String name;
    private String phoneNumber;
    private String productSold;

}
