package com.cocin.waifuwar.service;

import com.cocin.waifuwar.dto.CardCollectionDTO;
import com.cocin.waifuwar.dto.CollectionImageDTO;
import com.cocin.waifuwar.dto.DialogueItemDTO;
import com.cocin.waifuwar.exception.BadRequestException;
import com.cocin.waifuwar.exception.ResourceNotFoundException;
import com.cocin.waifuwar.model.Card;
import com.cocin.waifuwar.model.CardCollection;
import com.cocin.waifuwar.model.CollectionImage;
import com.cocin.waifuwar.model.Dialogue;
import com.cocin.waifuwar.repository.CardCollectionRepository;
import com.cocin.waifuwar.repository.CardRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CardCollectionService {

    private final CardCollectionRepository collectionRepository;
    private final CardRepository cardRepository;

    public CardCollectionService(CardCollectionRepository collectionRepository,
                                 CardRepository cardRepository) {
        this.collectionRepository = collectionRepository;
        this.cardRepository = cardRepository;
    }

    public CardCollectionDTO createCollection(CardCollectionDTO dto) {
        Card card = cardRepository.findById(dto.getCardId())
                .orElseThrow(() -> new ResourceNotFoundException("Card", dto.getCardId()));

        if (collectionRepository.existsByCardIdAndName(dto.getCardId(), dto.getName())) {
            throw new BadRequestException("Collection with name '" + dto.getName() + "' already exists for this card");
        }

        CardCollection collection = new CardCollection();
        collection.setCard(card);
        collection.setName(dto.getName());
        collection.setDescription(dto.getDescription());
        collection.setOrderIndex((int) collectionRepository.countByCardId(dto.getCardId()));

        CardCollection saved = collectionRepository.save(collection);
        return convertToDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<CardCollectionDTO> getCollectionsByCardId(Long cardId) {
        return collectionRepository.findByCardIdWithImages(cardId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CardCollectionDTO getCollectionById(Long id) {
        CardCollection collection = collectionRepository.findByIdWithImagesAndDialogues(id)
                .orElseThrow(() -> new ResourceNotFoundException("Collection", id));
        return convertToDTO(collection);
    }

    public CardCollectionDTO updateCollection(Long id, CardCollectionDTO dto) {
        CardCollection collection = collectionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Collection", id));

        if (!collection.getName().equals(dto.getName()) &&
                collectionRepository.existsByCardIdAndName(collection.getCard().getId(), dto.getName())) {
            throw new BadRequestException("Collection with name '" + dto.getName() + "' already exists for this card");
        }

        collection.setName(dto.getName());
        collection.setDescription(dto.getDescription());

        CardCollection updated = collectionRepository.save(collection);
        return convertToDTO(updated);
    }

    public void deleteCollection(Long id) {
        CardCollection collection = collectionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Collection", id));
        collectionRepository.delete(collection);
    }

    @Transactional(readOnly = true)
    public List<CardCollectionDTO> searchCollectionsByName(String name) {
        return collectionRepository.findByNameContainingIgnoreCase(name).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

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
