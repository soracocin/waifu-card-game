package com.cocin.waifuwar.controller;

import com.cocin.waifuwar.dto.CardCollectionDTO;
import com.cocin.waifuwar.service.CardCollectionService;
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
public class CardCollectionController {

    @Autowired
    private CardCollectionService collectionService;

    // Get all collections for a card
    @GetMapping("/cards/{cardId}/collections")
    public ResponseEntity<List<CardCollectionDTO>> getCollectionsByCardId(@PathVariable Long cardId) {
        try {
            List<CardCollectionDTO> collections = collectionService.getCollectionsByCardId(cardId);
            return ResponseEntity.ok(collections);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Create a new collection for a card
    @PostMapping("/cards/{cardId}/collections")
    public ResponseEntity<?> createCollection(@PathVariable Long cardId, 
                                            @Valid @RequestBody CardCollectionDTO dto) {
        try {
            dto.setCardId(cardId); // Ensure cardId matches path parameter
            CardCollectionDTO created = collectionService.createCollection(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An unexpected error occurred"));
        }
    }

    // Get collection details by ID
    @GetMapping("/collections/{collectionId}")
    public ResponseEntity<?> getCollectionById(@PathVariable Long collectionId) {
        try {
            CardCollectionDTO collection = collectionService.getCollectionById(collectionId);
            return ResponseEntity.ok(collection);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An unexpected error occurred"));
        }
    }

    // Update collection
    @PutMapping("/collections/{collectionId}")
    public ResponseEntity<?> updateCollection(@PathVariable Long collectionId,
                                            @Valid @RequestBody CardCollectionDTO dto) {
        try {
            CardCollectionDTO updated = collectionService.updateCollection(collectionId, dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An unexpected error occurred"));
        }
    }

    // Delete collection
    @DeleteMapping("/collections/{collectionId}")
    public ResponseEntity<?> deleteCollection(@PathVariable Long collectionId) {
        try {
            collectionService.deleteCollection(collectionId);
            return ResponseEntity.ok(Map.of("message", "Collection deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An unexpected error occurred"));
        }
    }

    // Search collections by name
    @GetMapping("/collections")
    public ResponseEntity<List<CardCollectionDTO>> searchCollections(@RequestParam String name) {
        try {
            List<CardCollectionDTO> collections = collectionService.searchCollectionsByName(name);
            return ResponseEntity.ok(collections);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}