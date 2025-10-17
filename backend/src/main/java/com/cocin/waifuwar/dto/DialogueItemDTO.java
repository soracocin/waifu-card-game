package com.cocin.waifuwar.dto;

import java.time.LocalDateTime;

public class DialogueItemDTO {
    private Long id;
    private Long imageId;
    private String text;
    private String speaker;
    private Integer orderIndex;
    private String emotionType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public DialogueItemDTO() {}

    public DialogueItemDTO(Long id, Long imageId, String text, String speaker, 
                          Integer orderIndex, String emotionType, 
                          LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.imageId = imageId;
        this.text = text;
        this.speaker = speaker;
        this.orderIndex = orderIndex;
        this.emotionType = emotionType;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getImageId() {
        return imageId;
    }

    public void setImageId(Long imageId) {
        this.imageId = imageId;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getSpeaker() {
        return speaker;
    }

    public void setSpeaker(String speaker) {
        this.speaker = speaker;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    public String getEmotionType() {
        return emotionType;
    }

    public void setEmotionType(String emotionType) {
        this.emotionType = emotionType;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}