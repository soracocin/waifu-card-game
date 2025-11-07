package com.cocin.waifuwar.service;

import com.cocin.waifuwar.dto.CardDTO;
import com.cocin.waifuwar.dto.GachaResultDTO;
import com.cocin.waifuwar.exception.BadRequestException;
import com.cocin.waifuwar.exception.ResourceNotFoundException;
import com.cocin.waifuwar.mapper.CardMapper;
import com.cocin.waifuwar.model.Card;
import com.cocin.waifuwar.model.User;
import com.cocin.waifuwar.model.UserCard;
import com.cocin.waifuwar.repository.CardRepository;
import com.cocin.waifuwar.repository.UserCardRepository;
import com.cocin.waifuwar.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class GachaService {

    private final CardRepository cardRepository;
    private final UserRepository userRepository;
    private final UserCardRepository userCardRepository;
    private final Random random = new SecureRandom();

    private static final int COMMON_RATE = 70;
    private static final int RARE_RATE = 25;
    private static final int EPIC_RATE = 4;
    private static final int LEGENDARY_RATE = 1;

    private static final int SINGLE_PULL_COST_COINS = 100;
    private static final int SINGLE_PULL_COST_GEMS = 1;
    private static final int TEN_PULL_COST_COINS = 900;
    private static final int TEN_PULL_COST_GEMS = 9;

    public GachaService(CardRepository cardRepository,
                        UserRepository userRepository,
                        UserCardRepository userCardRepository) {
        this.cardRepository = cardRepository;
        this.userRepository = userRepository;
        this.userCardRepository = userCardRepository;
    }

    @Transactional
    public GachaResultDTO performSinglePull(Long userId, boolean useGems) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        int cost = useGems ? SINGLE_PULL_COST_GEMS : SINGLE_PULL_COST_COINS;
        validateCurrency(user, cost, useGems);
        deductCurrency(user, cost, useGems);

        Card drawnCard = drawRandomCard();
        upsertUserCard(user, drawnCard);
        userRepository.save(user);

        List<CardDTO> cards = List.of(CardMapper.toDto(drawnCard));
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
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        int cost = useGems ? TEN_PULL_COST_GEMS : TEN_PULL_COST_COINS;
        validateCurrency(user, cost, useGems);
        deductCurrency(user, cost, useGems);

        List<Card> drawnCards = new ArrayList<>();
        boolean needsGuaranteedRare = true;

        for (int i = 0; i < 10; i++) {
            Card drawnCard;
            if (i == 9 && needsGuaranteedRare) {
                drawnCard = drawGuaranteedRareCard();
            } else {
                drawnCard = drawRandomCard();
                if (drawnCard.getRarity() != Card.Rarity.COMMON) {
                    needsGuaranteedRare = false;
                }
            }
            drawnCards.add(drawnCard);
            upsertUserCard(user, drawnCard);
        }

        userRepository.save(user);

        List<CardDTO> cardDTOs = drawnCards.stream()
                .map(CardMapper::toDto)
                .toList();

        return new GachaResultDTO(
                cardDTOs,
                cost,
                useGems ? "TEN_GEM" : "TEN_COIN",
                user.getCoins(),
                user.getGems()
        );
    }

    private void validateCurrency(User user, int cost, boolean useGems) {
        if (useGems && user.getGems() < cost) {
            throw new BadRequestException("Not enough gems");
        }
        if (!useGems && user.getCoins() < cost) {
            throw new BadRequestException("Not enough coins");
        }
    }

    private void deductCurrency(User user, int cost, boolean useGems) {
        if (useGems) {
            user.setGems(user.getGems() - cost);
        } else {
            user.setCoins(user.getCoins() - cost);
        }
    }

    private void upsertUserCard(User user, Card card) {
        UserCard userCard = userCardRepository.findByUserAndCard(user, card)
                .orElse(new UserCard(user, card));

        if (userCard.getId() == null) {
            userCardRepository.save(userCard);
        } else {
            userCard.setExperience(userCard.getExperience() + 10);
            userCardRepository.save(userCard);
        }
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

        List<Card> cards = cardRepository.findByRarityAndIsActiveTrue(rarity);
        if (cards.isEmpty()) {
            cards = cardRepository.findByRarityAndIsActiveTrue(Card.Rarity.COMMON);
        }
        return cards.get(random.nextInt(cards.size()));
    }

    private Card drawGuaranteedRareCard() {
        int roll = random.nextInt(30) + 1;

        Card.Rarity rarity;
        if (roll <= 1) {
            rarity = Card.Rarity.LEGENDARY;
        } else if (roll <= 5) {
            rarity = Card.Rarity.EPIC;
        } else {
            rarity = Card.Rarity.RARE;
        }

        List<Card> cards = cardRepository.findByRarityAndIsActiveTrue(rarity);
        if (cards.isEmpty()) {
            cards = cardRepository.findByRarityAndIsActiveTrue(Card.Rarity.RARE);
        }
        return cards.get(random.nextInt(cards.size()));
    }
}
