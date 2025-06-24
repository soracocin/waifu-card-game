package com.cocin.waifuwar.service;

import com.cocin.waifuwar.dto.CardDTO;
import com.cocin.waifuwar.dto.GachaResultDTO;
import com.cocin.waifuwar.model.Card;
import com.cocin.waifuwar.model.User;
import com.cocin.waifuwar.model.UserCard;
import com.cocin.waifuwar.repository.CardRepository;
import com.cocin.waifuwar.repository.UserRepository;
import com.cocin.waifuwar.repository.UserCardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class GachaService {

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserCardRepository userCardRepository;

    private final Random random = new Random();

    // Gacha rates (percentages)
    private static final int COMMON_RATE = 70;
    private static final int RARE_RATE = 25;
    private static final int EPIC_RATE = 4;
    private static final int LEGENDARY_RATE = 1;

    // Gacha costs
    private static final int SINGLE_PULL_COST_COINS = 100;
    private static final int SINGLE_PULL_COST_GEMS = 1;
    private static final int TEN_PULL_COST_COINS = 900; // 10% discount
    private static final int TEN_PULL_COST_GEMS = 9;   // 10% discount

    @Transactional
    public GachaResultDTO performSinglePull(Long userId, boolean useGems) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        int cost = useGems ? SINGLE_PULL_COST_GEMS : SINGLE_PULL_COST_COINS;

        // Check if user has enough currency
        if (useGems && user.getGems() < cost) {
            throw new RuntimeException("Not enough gems");
        }
        if (!useGems && user.getCoins() < cost) {
            throw new RuntimeException("Not enough coins");
        }

        // Deduct currency
        if (useGems) {
            user.setGems(user.getGems() - cost);
        } else {
            user.setCoins(user.getCoins() - cost);
        }

        // Perform gacha pull
        Card drawnCard = drawRandomCard();

        // Add card to user's collection
        UserCard userCard = userCardRepository.findByUserAndCard(user, drawnCard)
                .orElse(new UserCard(user, drawnCard));

        if (userCard.getId() == null) {
            // New card
            userCardRepository.save(userCard);
        } else {
            // Duplicate card - add experience
            userCard.setExperience(userCard.getExperience() + 10);
            userCardRepository.save(userCard);
        }

        userRepository.save(user);

        List<CardDTO> cards = List.of(new CardDTO(drawnCard));

        return new GachaResultDTO(
                cards,
                cost,
                useGems ? "SINGLE_GEM" : "SINGLE_COIN",
                user.getCoins(),
                user.getGems()
        );
    }

    @Transactional
    public GachaResultDTO performTenPull(Long userId, boolean useGems) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        int cost = useGems ? TEN_PULL_COST_GEMS : TEN_PULL_COST_COINS;

        // Check if user has enough currency
        if (useGems && user.getGems() < cost) {
            throw new RuntimeException("Not enough gems");
        }
        if (!useGems && user.getCoins() < cost) {
            throw new RuntimeException("Not enough coins");
        }

        // Deduct currency
        if (useGems) {
            user.setGems(user.getGems() - cost);
        } else {
            user.setCoins(user.getCoins() - cost);
        }

        List<Card> drawnCards = new ArrayList<>();
        boolean guaranteedRare = true; // Guarantee at least one rare or higher

        for (int i = 0; i < 10; i++) {
            Card drawnCard;
            if (i == 9 && guaranteedRare) {
                // Last pull and no rare+ card yet, force rare+
                drawnCard = drawGuaranteedRareCard();
            } else {
                drawnCard = drawRandomCard();
                if (drawnCard.getRarity() != Card.Rarity.COMMON) {
                    guaranteedRare = false;
                }
            }
            drawnCards.add(drawnCard);

            // Add to user's collection
            UserCard userCard = userCardRepository.findByUserAndCard(user, drawnCard)
                    .orElse(new UserCard(user, drawnCard));

            if (userCard.getId() == null) {
                userCardRepository.save(userCard);
            } else {
                userCard.setExperience(userCard.getExperience() + 10);
                userCardRepository.save(userCard);
            }
        }

        userRepository.save(user);

        List<CardDTO> cardDTOs = drawnCards.stream()
                .map(CardDTO::new)
                .collect(Collectors.toList());

        return new GachaResultDTO(
                cardDTOs,
                cost,
                useGems ? "TEN_GEM" : "TEN_COIN",
                user.getCoins(),
                user.getGems()
        );
    }

    private Card drawRandomCard() {
        int roll = random.nextInt(100) + 1;

        Card.Rarity rarity;
        if (roll <= LEGENDARY_RATE) {
            rarity = Card.Rarity.LEGENDARY;
        } else if (roll <= LEGENDARY_RATE + EPIC_RATE) {
            rarity = Card.Rarity.EPIC;
        } else if (roll <= LEGENDARY_RATE + EPIC_RATE + RARE_RATE) {
            rarity = Card.Rarity.RARE;
        } else {
            rarity = Card.Rarity.COMMON;
        }

        List<Card> cardsOfRarity = cardRepository.findByRarity(rarity);
        if (cardsOfRarity.isEmpty()) {
            // Fallback to common if no cards of selected rarity
            cardsOfRarity = cardRepository.findByRarity(Card.Rarity.COMMON);
        }

        return cardsOfRarity.get(random.nextInt(cardsOfRarity.size()));
    }

    private Card drawGuaranteedRareCard() {
        int roll = random.nextInt(30) + 1; // Only rare+ cards

        Card.Rarity rarity;
        if (roll <= 1) {
            rarity = Card.Rarity.LEGENDARY;
        } else if (roll <= 5) {
            rarity = Card.Rarity.EPIC;
        } else {
            rarity = Card.Rarity.RARE;
        }

        List<Card> cardsOfRarity = cardRepository.findByRarity(rarity);
        if (cardsOfRarity.isEmpty()) {
            cardsOfRarity = cardRepository.findByRarity(Card.Rarity.RARE);
        }

        return cardsOfRarity.get(random.nextInt(cardsOfRarity.size()));
    }
}