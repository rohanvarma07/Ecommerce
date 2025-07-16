package com.webapp.webApp.Model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "products") // Specifies the table name in the database
public class Products {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increments primary key
    private int id;
    private String description;
    private int model; // Assuming this is an integer field like a model number
    private int quantity;
    private BigDecimal price;
    private String imgUrl; // Field to store the URL/path of the product image

    // --- Constructors ---

    // 1. Default (no-argument) constructor - REQUIRED by JPA/Hibernate
    public Products() {
    }

    // 2. Constructor for creating a NEW product (without 'id', as it's auto-generated)
    public Products(String description, int model, int quantity, BigDecimal price, String imgUrl) {
        this.description = description;
        this.model = model;
        this.quantity = quantity;
        this.price = price;
        this.imgUrl = imgUrl;
    }

    // Optional: 3. Constructor for creating/updating a product (with 'id' and all fields)
    // This can be useful for DTO mapping or when you need to re-create an existing entity.
    public Products(int id, String description, int model, int quantity, BigDecimal price, String imgUrl) {
        this.id = id;
        this.description = description;
        this.model = model;
        this.quantity = quantity;
        this.price = price;
        this.imgUrl = imgUrl;
    }


    // --- Getters and Setters ---

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getModel() {
        return model;
    }

    public void setModel(int model) {
        this.model = model;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public void setImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }

    // --- toString Method ---

    @Override
    public String toString() {
        return "Products{" +
                "id=" + id +
                ", description='" + description + '\'' +
                ", model=" + model +
                ", quantity=" + quantity +
                ", price=" + price +
                ", imgUrl='" + imgUrl + '\'' + // Ensure imgUrl is included here
                '}';
    }
}