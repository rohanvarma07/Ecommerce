package com.webapp.webApp.Controller;

import com.webapp.webApp.Model.Products;
import com.webapp.webApp.Service.productService;
import com.webapp.webApp.Service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class productController {

    @Autowired
    private productService service;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping("/products")
    public List<Products> getAllProducts() {
        return service.getAllProducts();
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<Products> getProducts(@PathVariable int id) {
        Products product = service.getProducts(id);
        if (product != null) {
            return ResponseEntity.ok(product);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/products")
    public ResponseEntity<Products> createProduct(
            @RequestParam String description,
            @RequestParam int model,
            @RequestParam int quantity,
            @RequestParam BigDecimal price,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {

        String imgUrl = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            imgUrl = fileStorageService.storeFile(imageFile);
        }

        Products newProduct = new Products(description, model, quantity, price, imgUrl);
        Products savedProduct = service.createProduct(newProduct);
        return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Products> updateProducts(
            @PathVariable int id,
            @RequestParam String description,
            @RequestParam int model,
            @RequestParam int quantity,
            @RequestParam BigDecimal price,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {

        Products existingProduct = service.getProducts(id);
        if (existingProduct == null) {
            return ResponseEntity.notFound().build();
        }

        existingProduct.setDescription(description);
        existingProduct.setModel(model);
        existingProduct.setQuantity(quantity);
        existingProduct.setPrice(price);

        if (imageFile != null && !imageFile.isEmpty()) {
            String newImgUrl = fileStorageService.storeFile(imageFile);
            existingProduct.setImgUrl(newImgUrl);
        }

        Products updatedProduct = service.updateProducts(existingProduct);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProducts(@PathVariable int id) {
        Products productToDelete = service.getProducts(id);
        if (productToDelete == null) {
            return ResponseEntity.notFound().build();
        }
        service.deleteProducts(id);
        return ResponseEntity.noContent().build();
    }
}
