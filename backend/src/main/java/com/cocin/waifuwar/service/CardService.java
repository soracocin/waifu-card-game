package com.cocin.waifuwar.service;

import com.cocin.waifuwar.dto.CardDTO;
import com.cocin.waifuwar.model.Card;
import com.cocin.waifuwar.model.UserCard;
import com.cocin.waifuwar.repository.CardRepository;
import com.cocin.waifuwar.repository.UserCardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CardService {

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private UserCardRepository userCardRepository;

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
}