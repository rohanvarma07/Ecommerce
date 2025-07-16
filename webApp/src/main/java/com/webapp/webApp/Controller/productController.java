package com.webapp.webApp.Controller;

import com.webapp.webApp.Model.Products; // Your Products model
import com.webapp.webApp.Service.productService; // Your productService
import com.webapp.webApp.Service.FileStorageService; // <-- NEW: Import FileStorageService

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus; // For HTTP status codes like CREATED, NOT_FOUND
import org.springframework.http.ResponseEntity; // For returning detailed HTTP responses
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile; // For handling file uploads

import java.math.BigDecimal; // <-- NEW: Import for BigDecimal if your price is BigDecimal
import java.util.List;


@RestController
@RequestMapping("/api")
@CrossOrigin // Allows requests from your frontend (e.g., React on localhost:5173)
public class productController {

    @Autowired
    private productService service; // Your existing productService

    @Autowired // <-- NEW: Inject FileStorageService
    private FileStorageService fileStorageService;


    // Get all products
    @GetMapping("/products")
    public List<Products> getAllProducts() {
        return service.getAllProducts();
    }

    // Get product by ID
    @GetMapping("/products/{id}")
    public ResponseEntity<Products> getProducts(@PathVariable int id) {
        Products product = service.getProducts(id); // Assuming getProducts returns null if not found
        if (product != null) {
            return ResponseEntity.ok(product); // Return 200 OK with product
        } else {
            return ResponseEntity.notFound().build(); // Return 404 Not Found
        }
    }

    // --- MODIFIED: Create Product to handle MultipartFile and form data ---
    // Frontend will send this as multipart/form-data
    @PostMapping("/products")
    public ResponseEntity<Products> createProduct(
            @RequestParam("description") String description, // Use @RequestParam for each form field
            @RequestParam("model") int model, // Assuming 'model' field is an int
            @RequestParam("quantity") int quantity,
            @RequestParam("price") BigDecimal price, // Assuming price is BigDecimal
            @RequestParam(value = "image", required = false) MultipartFile imageFile) { // 'image' is the name the frontend sends

        String imgUrl = null; // Default to null if no image is uploaded
        if (imageFile != null && !imageFile.isEmpty()) {
            imgUrl = fileStorageService.storeFile(imageFile); // Store the file and get its URL
        }

        // Create a new Products object with the gathered data
        Products newProduct = new Products(description, model, quantity, price, imgUrl);
        Products savedProduct = service.createProduct(newProduct); // Pass the new product to your service
        return new ResponseEntity<>(savedProduct, HttpStatus.CREATED); // Return 201 Created status
    }
    // --- END MODIFIED: Create Product ---


    // --- MODIFIED: Update Product to handle MultipartFile and form data ---
    // Frontend will send this as multipart/form-data
    @PutMapping("/products/{id}")
    public ResponseEntity<Products> updateProducts(
            @PathVariable int id,
            @RequestParam("description") String description,
            @RequestParam("model") int model, // Assuming 'model' field is an int
            @RequestParam("quantity") int quantity,
            @RequestParam("price") BigDecimal price, // Assuming price is BigDecimal
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {

        Products existingProduct = service.getProducts(id); // Get the product from the database by ID

        if (existingProduct == null) {
            return ResponseEntity.notFound().build(); // Return 404 if product not found
        }

        // Update fields of the existing product from request parameters
        existingProduct.setDescription(description);
        existingProduct.setModel(model); // Update model
        existingProduct.setQuantity(quantity);
        existingProduct.setPrice(price);

        // Handle image update: If a new image is provided, store it and update the URL.
        // You might want to add logic here to delete the old image file from the server's
        // file system if it's no longer needed, to prevent clutter.
        if (imageFile != null && !imageFile.isEmpty()) {
            String newImgUrl = fileStorageService.storeFile(imageFile);
            existingProduct.setImgUrl(newImgUrl);
        }
        // If no new image is provided (imageFile is null or empty), existingProduct.imgUrl will retain its old value.

        Products updatedProduct = service.updateProducts(existingProduct); // Pass the updated product to your service
        return ResponseEntity.ok(updatedProduct); // Return 200 OK
    }
    // --- END MODIFIED: Update Product ---

    // Delete product
    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProducts(@PathVariable int id) {
        Products productToDelete = service.getProducts(id); // Check if product exists before deleting
        if (productToDelete == null) {
            return ResponseEntity.notFound().build(); // Return 404 if product not found
        }
        // Optional: Add logic here to delete the image file from the server's
        // file system using productToDelete.getImgUrl() if needed.
        service.deleteProducts(id); // Call your service to delete
        return ResponseEntity.noContent().build(); // Return 204 No Content for successful deletion
    }
}