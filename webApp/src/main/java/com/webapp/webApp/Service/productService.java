package com.webapp.webApp.Service;

import com.webapp.webApp.Model.Products;
import com.webapp.webApp.Repo.repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class productService {
    @Autowired
    private repository repo;

    public List<Products> getAllProducts() {
        return repo.findAll();
    }

    public Products getProducts(int id) {
        return repo.findById(id).orElse(null);
    }


    public Products createProduct(Products id) {
        return repo.save(id);
    }

    public Products updateProducts(Products product)
    {
        return repo.save(product);
    }


    public void deleteProducts(int id) {
        repo.deleteById(id);
    }
}
