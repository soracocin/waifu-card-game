package com.cocin.waifuwar.service;

import com.cocin.waifuwar.dto.CollectionImageDTO;
import com.cocin.waifuwar.dto.DialogueItemDTO;
import com.cocin.waifuwar.model.CardCollection;
import com.cocin.waifuwar.model.CollectionImage;
import com.cocin.waifuwar.model.Dialogue;
import com.cocin.waifuwar.repository.CardCollectionRepository;
import com.cocin.waifuwar.repository.CollectionImageRepository;
import com.cocin.waifuwar.repository.DialogueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CollectionImageService {

    @Autowired
    private CollectionImageRepository imageRepository;
    
    @Autowired
    private CardCollectionRepository collectionRepository;
    
    @Autowired
    private DialogueRepository dialogueRepository;

    // Image CRUD operations
    public CollectionImageDTO createImage(CollectionImageDTO dto) {
        Optional<CardCollection> collection = collectionRepository.findById(dto.getCollectionId());
        if (collection.isEmpty()) {
            throw new RuntimeException("Collection not found with id: " + dto.getCollectionId());
        }
        
        CollectionImage image = new CollectionImage();
        image.setCollection(collection.get());
        image.setImageUrl(dto.getImageUrl());
        image.setTitle(dto.getTitle());
        image.setDescription(dto.getDescription());
        
        // Set order index as the next available position
        long count = imageRepository.countByCollectionId(dto.getCollectionId());
        image.setOrderIndex((int) count);
        
        CollectionImage saved = imageRepository.save(image);
        return convertToDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<CollectionImageDTO> getImagesByCollectionId(Long collectionId) {
        List<CollectionImage> images = imageRepository.findByCollectionIdWithDialogues(collectionId);
        return images.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CollectionImageDTO getImageById(Long id) {
        CollectionImage image = imageRepository.findByIdWithDialogues(id);
        if (image == null) {
            throw new RuntimeException("Image not found with id: " + id);
        }
        return convertToDTO(image);
    }

    public CollectionImageDTO updateImage(Long id, CollectionImageDTO dto) {
        CollectionImage image = imageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Image not found with id: " + id));
        
        image.setImageUrl(dto.getImageUrl());
        image.setTitle(dto.getTitle());
        image.setDescription(dto.getDescription());
        if (dto.getOrderIndex() != null) {
            image.setOrderIndex(dto.getOrderIndex());
        }
        
        CollectionImage updated = imageRepository.save(image);
        return convertToDTO(updated);
    }

    public void deleteImage(Long id) {
        if (!imageRepository.existsById(id)) {
            throw new RuntimeException("Image not found with id: " + id);
        }
        imageRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<CollectionImageDTO> searchImagesByTitle(Long collectionId, String title) {
        List<CollectionImage> images = imageRepository.findByCollectionIdAndTitleContainingIgnoreCase(collectionId, title);
        return images.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public void reorderImages(Long collectionId, List<Long> imageIdsInOrder) {
        List<CollectionImage> images = imageRepository.findByCollectionIdOrderByOrderIndexAsc(collectionId);
        
        for (int i = 0; i < imageIdsInOrder.size(); i++) {
            Long imageId = imageIdsInOrder.get(i);
            CollectionImage image = images.stream()
                    .filter(img -> img.getId().equals(imageId))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Image not found with id: " + imageId));
            
            image.setOrderIndex(i);
            imageRepository.save(image);
        }
    }

    // Helper method to convert entity to DTO
    private CollectionImageDTO convertToDTO(CollectionImage image) {
        List<DialogueItemDTO> dialogueDTOs = image.getDialogues().stream()
                .map(this::convertDialogueToDTO)
                .collect(Collectors.toList());
        
        return new CollectionImageDTO(
                image.getId(),
                image.getCollection().getId(),
                image.getImageUrl(),
                image.getTitle(),
                image.getDescription(),
                image.getOrderIndex(),
                dialogueDTOs
        );
    }

    private DialogueItemDTO convertDialogueToDTO(Dialogue dialogue) {
        return new DialogueItemDTO(
                dialogue.getId(),
                dialogue.getImage().getId(),
                dialogue.getText(),
                dialogue.getSpeaker(),
                dialogue.getOrderIndex(),
                dialogue.getEmotionType() != null ? dialogue.getEmotionType().toString() : null,
                dialogue.getCreatedAt(),
                dialogue.getUpdatedAt()
        );
    }
}