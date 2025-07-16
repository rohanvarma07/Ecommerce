package com.webapp.webApp.Repo;

import com.webapp.webApp.Model.Products;
import org.springframework.data.jpa.repository.JpaRepository;

public interface repository extends JpaRepository<Products,Integer> {
}
