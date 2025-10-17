package com.cocin.waifuwar.service;

import com.cocin.waifuwar.dto.CardCollectionDTO;
import com.cocin.waifuwar.dto.CollectionImageDTO;
import com.cocin.waifuwar.dto.DialogueItemDTO;
import com.cocin.waifuwar.model.Card;
import com.cocin.waifuwar.model.CardCollection;
import com.cocin.waifuwar.model.CollectionImage;
import com.cocin.waifuwar.model.Dialogue;
import com.cocin.waifuwar.repository.CardCollectionRepository;
import com.cocin.waifuwar.repository.CardRepository;
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
public class CardCollectionService {

    @Autowired
    private CardCollectionRepository collectionRepository;
    
    @Autowired
    private CardRepository cardRepository;
    
    @Autowired
    private CollectionImageRepository imageRepository;
    
    @Autowired
    private DialogueRepository dialogueRepository;

    // Collection CRUD operations
    public CardCollectionDTO createCollection(CardCollectionDTO dto) {
        Optional<Card> card = cardRepository.findById(dto.getCardId());
        if (card.isEmpty()) {
            throw new RuntimeException("Card not found with id: " + dto.getCardId());
        }
        
        // Check if collection name already exists for this card
        if (collectionRepository.existsByCardIdAndName(dto.getCardId(), dto.getName())) {
            throw new RuntimeException("Collection with name '" + dto.getName() + "' already exists for this card");
        }
        
        CardCollection collection = new CardCollection();
        collection.setCard(card.get());
        collection.setName(dto.getName());
        collection.setDescription(dto.getDescription());
        
        // Set order index as the next available position
        long count = collectionRepository.countByCardId(dto.getCardId());
        collection.setOrderIndex((int) count);
        
        CardCollection saved = collectionRepository.save(collection);
        return convertToDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<CardCollectionDTO> getCollectionsByCardId(Long cardId) {
        List<CardCollection> collections = collectionRepository.findByCardIdWithImages(cardId);
        return collections.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CardCollectionDTO getCollectionById(Long id) {
        CardCollection collection = collectionRepository.findByIdWithImagesAndDialogues(id);
        if (collection == null) {
            throw new RuntimeException("Collection not found with id: " + id);
        }
        return convertToDTO(collection);
    }

    public CardCollectionDTO updateCollection(Long id, CardCollectionDTO dto) {
        CardCollection collection = collectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Collection not found with id: " + id));
        
        // Check if new name conflicts with existing collections (except current one)
        if (!collection.getName().equals(dto.getName()) && 
            collectionRepository.existsByCardIdAndName(collection.getCard().getId(), dto.getName())) {
            throw new RuntimeException("Collection with name '" + dto.getName() + "' already exists for this card");
        }
        
        collection.setName(dto.getName());
        collection.setDescription(dto.getDescription());
        
        CardCollection updated = collectionRepository.save(collection);
        return convertToDTO(updated);
    }

    public void deleteCollection(Long id) {
        if (!collectionRepository.existsById(id)) {
            throw new RuntimeException("Collection not found with id: " + id);
        }
        collectionRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<CardCollectionDTO> searchCollectionsByName(String name) {
        List<CardCollection> collections = collectionRepository.findByNameContainingIgnoreCase(name);
        return collections.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Helper method to convert entity to DTO
    private CardCollectionDTO convertToDTO(CardCollection collection) {
        List<CollectionImageDTO> imageDTOs = collection.getImages().stream()
                .map(this::convertImageToDTO)
                .collect(Collectors.toList());
        
        return new CardCollectionDTO(
                collection.getId(),
                collection.getCard().getId(),
                collection.getName(),
                collection.getDescription(),
                imageDTOs
        );
    }

    private CollectionImageDTO convertImageToDTO(CollectionImage image) {
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