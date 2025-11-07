package com.cocin.waifuwar.mapper;

import com.cocin.waifuwar.dto.CardDTO;
import com.cocin.waifuwar.exception.BadRequestException;
import com.cocin.waifuwar.model.Card;

import java.util.Collection;
import java.util.List;
import java.util.Locale;
import java.util.function.Function;
import java.util.stream.Collectors;

public final class CardMapper {

    private CardMapper() {
    }

    public static CardDTO toDto(Card card) {
        CardDTO dto = new CardDTO();
        dto.setId(card.getId());
        dto.setName(card.getName());
        dto.setDescription(card.getDescription());
        dto.setAttack(card.getAttack());
        dto.setDefense(card.getDefense());
        dto.setCost(card.getCost());
        dto.setRarity(card.getRarity().name());
        dto.setElement(card.getElement().name());
        dto.setImageUrl(card.getImageUrl());
        return dto;
    }

    public static List<CardDTO> toDtoList(Collection<Card> cards) {
        return cards.stream().map(CardMapper::toDto).collect(Collectors.toList());
    }

    public static Card toEntity(CardDTO dto) {
        Card card = new Card();
        card.setIsActive(Boolean.TRUE);
        updateEntity(card, dto);
        return card;
    }

    public static void updateEntity(Card card, CardDTO dto) {
        card.setName(dto.getName());
        card.setDescription(dto.getDescription());
        card.setAttack(dto.getAttack());
        card.setDefense(dto.getDefense());
        card.setCost(dto.getCost());
        card.setRarity(parseEnum(dto.getRarity(), "rarity", value -> Card.Rarity.valueOf(value)));
        card.setElement(parseEnum(dto.getElement(), "element", value -> Card.Element.valueOf(value)));
        if (dto.getImageUrl() != null && !dto.getImageUrl().isBlank()) {
            card.setImageUrl(dto.getImageUrl());
        }
    }

    private static <E extends Enum<E>> E parseEnum(String rawValue, String fieldName, Function<String, E> converter) {
        if (rawValue == null) {
            throw new BadRequestException(fieldName + " must not be null");
        }
        try {
            return converter.apply(rawValue.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Unsupported " + fieldName + ": " + rawValue);
        }
    }
}
