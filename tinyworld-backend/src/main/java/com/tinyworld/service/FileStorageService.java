package com.tinyworld.service;

import com.tinyworld.config.FileStorageConfig;
import com.tinyworld.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {
    
    private final Path fileStorageLocation;
    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList("jpg", "jpeg", "png", "gif");
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    
    public FileStorageService(FileStorageConfig fileStorageConfig) {
        this.fileStorageLocation = Paths.get(fileStorageConfig.getUploadDir())
                .toAbsolutePath().normalize();
        
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where uploaded files will be stored.", ex);
        }
    }
    
    public String storeFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("File is empty");
        }
        
        // Validate file size
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException("File size exceeds maximum allowed size (5MB)");
        }
        
        // Validate file extension
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String extension = getFileExtension(originalFilename);
        
        if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new BadRequestException("Invalid file type. Only JPG, JPEG, PNG, and GIF files are allowed.");
        }
        
        // Generate unique filename
        String uniqueFilename = generateUniqueFilename(originalFilename);
        Path targetLocation = this.fileStorageLocation.resolve(uniqueFilename);
        
        try {
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return uniqueFilename;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFilename + ". Please try again!", ex);
        }
    }
    
    public void deleteFile(String filename) {
        try {
            Path file = this.fileStorageLocation.resolve(filename).normalize();
            Files.deleteIfExists(file);
        } catch (IOException ex) {
            throw new RuntimeException("Could not delete file " + filename, ex);
        }
    }
    
    public Resource loadFileAsResource(String filename) {
        try {
            Path filePath = this.fileStorageLocation.resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("File not found " + filename);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File not found " + filename, ex);
        }
    }
    
    private String generateUniqueFilename(String originalFilename) {
        String extension = getFileExtension(originalFilename);
        String uniqueId = UUID.randomUUID().toString();
        return System.currentTimeMillis() + "-" + uniqueId + "." + extension;
    }
    
    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1 || lastDotIndex == filename.length() - 1) {
            throw new BadRequestException("File must have an extension");
        }
        return filename.substring(lastDotIndex + 1);
    }
}

