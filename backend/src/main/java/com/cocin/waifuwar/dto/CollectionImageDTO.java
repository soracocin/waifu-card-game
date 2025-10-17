package com.cocin.waifuwar.dto;

import java.util.List;

public class CollectionImageDTO {
    private Long id;
    private Long collectionId;
    private String imageUrl;
    private String title;
    private String description;
    private Integer orderIndex;
    private List<DialogueItemDTO> dialogues;

    // Constructors
    public CollectionImageDTO() {}

    public CollectionImageDTO(Long id, Long collectionId, String imageUrl, String title, 
                            String description, Integer orderIndex, List<DialogueItemDTO> dialogues) {
        this.id = id;
        this.collectionId = collectionId;
        this.imageUrl = imageUrl;
        this.title = title;
        this.description = description;
        this.orderIndex = orderIndex;
        this.dialogues = dialogues;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCollectionId() {
        return collectionId;
    }

    public void setCollectionId(Long collectionId) {
        this.collectionId = collectionId;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    public List<DialogueItemDTO> getDialogues() {
        return dialogues;
    }

    public void setDialogues(List<DialogueItemDTO> dialogues) {
        this.dialogues = dialogues;
    }
}