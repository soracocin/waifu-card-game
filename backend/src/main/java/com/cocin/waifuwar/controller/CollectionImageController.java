package com.cocin.waifuwar.controller;

import com.cocin.waifuwar.dto.CollectionImageDTO;
import com.cocin.waifuwar.service.CollectionImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class CollectionImageController {

    @Autowired
    private CollectionImageService imageService;

    // Get all images for a collection
    @GetMapping("/collections/{collectionId}/images")
    public ResponseEntity<List<CollectionImageDTO>> getImagesByCollectionId(@PathVariable Long collectionId) {
        try {
            List<CollectionImageDTO> images = imageService.getImagesByCollectionId(collectionId);
            return ResponseEntity.ok(images);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Create a new image for a collection
    @PostMapping("/collections/{collectionId}/images")
    public ResponseEntity<?> createImage(@PathVariable Long collectionId,
                                       @Valid @RequestBody CollectionImageDTO dto) {
        try {
            dto.setCollectionId(collectionId); // Ensure collectionId matches path parameter
            CollectionImageDTO created = imageService.createImage(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An unexpected error occurred"));
        }
    }

    // Get image details by ID
    @GetMapping("/images/{imageId}")
    public ResponseEntity<?> getImageById(@PathVariable Long imageId) {
        try {
            CollectionImageDTO image = imageService.getImageById(imageId);
            return ResponseEntity.ok(image);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An unexpected error occurred"));
        }
    }

    // Update image
    @PutMapping("/images/{imageId}")
    public ResponseEntity<?> updateImage(@PathVariable Long imageId,
                                       @Valid @RequestBody CollectionImageDTO dto) {
        try {
            CollectionImageDTO updated = imageService.updateImage(imageId, dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An unexpected error occurred"));
        }
    }

    // Delete image
    @DeleteMapping("/images/{imageId}")
    public ResponseEntity<?> deleteImage(@PathVariable Long imageId) {
        try {
            imageService.deleteImage(imageId);
            return ResponseEntity.ok(Map.of("message", "Image deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An unexpected error occurred"));
        }
    }

    // Search images by title within a collection
    @GetMapping("/collections/{collectionId}/images/search")
    public ResponseEntity<List<CollectionImageDTO>> searchImages(@PathVariable Long collectionId,
                                                               @RequestParam String title) {
        try {
            List<CollectionImageDTO> images = imageService.searchImagesByTitle(collectionId, title);
            return ResponseEntity.ok(images);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Reorder images within a collection
    @PatchMapping("/collections/{collectionId}/reorder-images")
    public ResponseEntity<?> reorderImages(@PathVariable Long collectionId,
                                         @RequestBody Map<String, List<Long>> request) {
        try {
            List<Long> imageIdsInOrder = request.get("imageIds");
            if (imageIdsInOrder == null || imageIdsInOrder.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "imageIds array is required"));
            }
            
            imageService.reorderImages(collectionId, imageIdsInOrder);
            return ResponseEntity.ok(Map.of("message", "Images reordered successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An unexpected error occurred"));
        }
    }
}