package com.cocin.waifuwar.dto;

import java.util.List;

public class CardCollectionDTO {
    private Long id;
    private Long cardId;
    private String name;
    private String description;
    private List<CollectionImageDTO> images;

    // Constructors
    public CardCollectionDTO() {}

    public CardCollectionDTO(Long id, Long cardId, String name, String description, List<CollectionImageDTO> images) {
        this.id = id;
        this.cardId = cardId;
        this.name = name;
        this.description = description;
        this.images = images;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCardId() {
        return cardId;
    }

    public void setCardId(Long cardId) {
        this.cardId = cardId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<CollectionImageDTO> getImages() {
        return images;
    }

    public void setImages(List<CollectionImageDTO> images) {
        this.images = images;
    }
}