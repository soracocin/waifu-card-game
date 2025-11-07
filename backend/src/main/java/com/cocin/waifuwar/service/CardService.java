package com.cocin.waifuwar.service;

import com.cocin.waifuwar.dto.CardDTO;
import com.cocin.waifuwar.exception.BadRequestException;
import com.cocin.waifuwar.exception.ResourceNotFoundException;
import com.cocin.waifuwar.mapper.CardMapper;
import com.cocin.waifuwar.model.Card;
import com.cocin.waifuwar.model.UserCard;
import com.cocin.waifuwar.repository.CardRepository;
import com.cocin.waifuwar.repository.UserCardRepository;
import jakarta.annotation.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@Transactional
public class CardService {

    private final CardRepository cardRepository;
    private final UserCardRepository userCardRepository;
    private final FileStorageService fileStorageService;

    public CardService(CardRepository cardRepository,
                       UserCardRepository userCardRepository,
                       FileStorageService fileStorageService) {
        this.cardRepository = cardRepository;
        this.userCardRepository = userCardRepository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional(readOnly = true)
    public List<CardDTO> getAllCards() {
        return CardMapper.toDtoList(cardRepository.findAllByIsActiveTrueOrderByNameAsc());
    }

    @Transactional(readOnly = true)
    public List<CardDTO> getUserCards(Long userId) {
        return userCardRepository.findByUserId(userId).stream()
                .map(UserCard::getCard)
                .map(CardMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public CardDTO getCard(Long cardId) {
        return CardMapper.toDto(getActiveCard(cardId));
    }

    @Transactional(readOnly = true)
    public List<CardDTO> getCardsByRarity(String rarity) {
        Card.Rarity parsedRarity = parseRarity(rarity);
        return CardMapper.toDtoList(cardRepository.findByRarityAndIsActiveTrue(parsedRarity));
    }

    @Transactional(readOnly = true)
    public List<CardDTO> getCardsByElement(String element) {
        Card.Element parsedElement = parseElement(element);
        return CardMapper.toDtoList(cardRepository.findByElementAndIsActiveTrue(parsedElement));
    }

    public CardDTO createCard(CardDTO cardDTO, @Nullable MultipartFile file) {
        Card card = CardMapper.toEntity(cardDTO);
        if (hasFile(file)) {
            card.setImageUrl(storeFile(file, null));
        }
        Card savedCard = cardRepository.save(card);
        return CardMapper.toDto(savedCard);
    }

    public CardDTO updateCard(Long id, CardDTO cardDTO, @Nullable MultipartFile file) {
        Card existingCard = getActiveCard(id);
        CardMapper.updateEntity(existingCard, cardDTO);

        if (hasFile(file)) {
            existingCard.setImageUrl(storeFile(file, existingCard.getImageUrl()));
        }

        Card updatedCard = cardRepository.save(existingCard);
        return CardMapper.toDto(updatedCard);
    }

    public void deleteCard(Long id) {
        Card card = getActiveCard(id);
        card.setIsActive(false);
        cardRepository.save(card);
    }

    private Card getActiveCard(Long id) {
        Card card = cardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Card", id));
        if (Boolean.FALSE.equals(card.getIsActive())) {
            throw new ResourceNotFoundException("Card", id);
        }
        return card;
    }

    private Card.Rarity parseRarity(String rarity) {
        try {
            return Card.Rarity.valueOf(rarity.trim().toUpperCase());
        } catch (IllegalArgumentException | NullPointerException ex) {
            throw new BadRequestException("Unsupported rarity: " + rarity);
        }
    }

    private Card.Element parseElement(String element) {
        try {
            return Card.Element.valueOf(element.trim().toUpperCase());
        } catch (IllegalArgumentException | NullPointerException ex) {
            throw new BadRequestException("Unsupported element: " + element);
        }
    }

    private boolean hasFile(@Nullable MultipartFile file) {
        return file != null && !file.isEmpty();
    }

    private String storeFile(MultipartFile file, @Nullable String existingFile) {
        if (existingFile != null) {
            fileStorageService.deleteFile(existingFile);
        }
        return fileStorageService.storeFile(file, "cards");
    }
}
