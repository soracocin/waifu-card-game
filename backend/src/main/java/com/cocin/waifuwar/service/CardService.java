package com.cocin.waifuwar.service;

import com.cocin.waifuwar.dto.CardDTO;
import com.cocin.waifuwar.model.Card;
import com.cocin.waifuwar.model.UserCard;
import com.cocin.waifuwar.repository.CardRepository;
import com.cocin.waifuwar.repository.UserCardRepository;
import jakarta.annotation.Nullable;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CardService {

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private UserCardRepository userCardRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public List<CardDTO> getAllCards() {
        return cardRepository.findByIsActiveTrue().stream()
                .map(CardDTO::new)
                .collect(Collectors.toList());
    }

    public List<CardDTO> getUserCards(Long userId) {
        return userCardRepository.findByUserId(userId).stream()
                .map(userCard -> new CardDTO(userCard.getCard()))
                .collect(Collectors.toList());
    }

    public CardDTO getCard(Long cardId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Card not found"));
        return new CardDTO(card);
    }

    public List<CardDTO> getCardsByRarity(String rarity) {
        Card.Rarity cardRarity = Card.Rarity.valueOf(rarity.toUpperCase());
        return cardRepository.findByRarity(cardRarity).stream()
                .map(CardDTO::new)
                .collect(Collectors.toList());
    }

    public List<CardDTO> getCardsByElement(String element) {
        Card.Element cardElement = Card.Element.valueOf(element.toUpperCase());
        return cardRepository.findByElement(cardElement).stream()
                .map(CardDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public CardDTO createCard(CardDTO cardDTO, @Nullable MultipartFile file) {
        Card newCard = new Card();

        if (file != null && !file.isEmpty()) {
            String fileUrl = fileStorageService.storeFile(file);
            newCard.setImageUrl(fileUrl);
        } else {
            // Nếu không có file, có thể gán URL mặc định hoặc null
            newCard.setImageUrl(cardDTO.getImageUrl()); // Giữ lại URL cũ nếu có
        }

        newCard.setName(cardDTO.getName());
        newCard.setDescription(cardDTO.getDescription());
        newCard.setRarity(Card.Rarity.valueOf(cardDTO.getRarity().toUpperCase()));
        newCard.setElement(Card.Element.valueOf(cardDTO.getElement().toUpperCase()));
        newCard.setAttack(cardDTO.getAttack());
        newCard.setDefense(cardDTO.getDefense());
        newCard.setCost(cardDTO.getCost());
        newCard.setIsActive(true);

        Card savedCard = cardRepository.save(newCard);
        return new CardDTO(savedCard);
    }

    @Transactional
    public CardDTO updateCard(Long id, CardDTO cardDetailsDTO, @Nullable MultipartFile file) {
        Card existingCard = cardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Card not found with id: " + id));

        // Xử lý upload file mới
        if (file != null && !file.isEmpty()) {
            // Xóa file ảnh cũ nếu có
            if (existingCard.getImageUrl() != null) {
                fileStorageService.deleteFile(existingCard.getImageUrl());
            }
            // Lưu file mới và cập nhật URL
            String newFileUrl = fileStorageService.storeFile(file);
            existingCard.setImageUrl(newFileUrl);
        }
        // Không có file mới được upload, không làm gì với imageUrl

        // Cập nhật các thông tin khác
        existingCard.setName(cardDetailsDTO.getName());
        existingCard.setDescription(cardDetailsDTO.getDescription());
        existingCard.setRarity(Card.Rarity.valueOf(cardDetailsDTO.getRarity().toUpperCase()));
        existingCard.setElement(Card.Element.valueOf(cardDetailsDTO.getElement().toUpperCase()));
        existingCard.setAttack(cardDetailsDTO.getAttack());
        existingCard.setDefense(cardDetailsDTO.getDefense());
        existingCard.setCost(cardDetailsDTO.getCost());

        Card updatedCard = cardRepository.save(existingCard);
        return new CardDTO(updatedCard);
    }

    @Transactional
    public void deleteCard(Long id) {
        Card cardToDelete = cardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Card not found with id: " + id));

        // Perform a "soft delete"
        cardToDelete.setIsActive(false); // <-- CORRECTED setter name

        cardRepository.save(cardToDelete);
    }
}