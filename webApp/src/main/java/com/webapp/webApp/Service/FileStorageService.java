package com.webapp.webApp.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation; // Stores the path to your upload directory

    // Constructor: Injects the 'app.upload.dir' property and creates the directory
    public FileStorageService(@Value("${app.upload.dir}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation); // Create the directory if it doesn't exist
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    // Method to store a MultipartFile
    public String storeFile(MultipartFile file) {
        // Normalize file name to prevent directory traversal attacks
        String fileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));

        try {
            // Check if the file's name contains invalid characters
            if (fileName.contains("..")) {
                throw new RuntimeException("Filename contains invalid path sequence " + fileName);
            }

            // Generate a unique file name using UUID to avoid name collisions
            String fileExtension = "";
            int dotIndex = fileName.lastIndexOf('.');
            if (dotIndex > 0) {
                fileExtension = fileName.substring(dotIndex); // Get file extension (e.g., .jpg, .png)
            }
            String uniqueFileName = UUID.randomUUID().toString() + fileExtension; // Generate unique name

            // Resolve the target path for storing the file
            Path targetLocation = this.fileStorageLocation.resolve(uniqueFileName);
            // Copy file to the target location, replacing existing file with same name
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Return the relative URL path where the image will be served from.
            // This 'uploads' part must match your 'spring.web.resources.static-locations' configuration.
            return "/uploads/" + uniqueFileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }
}