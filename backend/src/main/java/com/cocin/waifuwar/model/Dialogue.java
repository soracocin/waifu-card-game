package com.cocin.waifuwar.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "dialogues")
public class Dialogue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "image_id", nullable = false)
    private CollectionImage image;

    @NotBlank
    @Column(columnDefinition = "TEXT", nullable = false)
    private String text;

    @Size(max = 100)
    @Column
    private String speaker;

    @Column
    private Integer orderIndex = 0;

    @Enumerated(EnumType.STRING)
    @Column
    private EmotionType emotionType = EmotionType.NEUTRAL;

    @Column
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Enum for emotion types
    public enum EmotionType {
        HAPPY, SAD, ANGRY, SURPRISED, NEUTRAL, EXCITED, CONFUSED, LOVE, EMBARRASSED
    }

    // Constructors
    public Dialogue() {}

    public Dialogue(CollectionImage image, String text, String speaker, Integer orderIndex, EmotionType emotionType) {
        this.image = image;
        this.text = text;
        this.speaker = speaker;
        this.orderIndex = orderIndex;
        this.emotionType = emotionType;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Lifecycle callbacks
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CollectionImage getImage() {
        return image;
    }

    public void setImage(CollectionImage image) {
        this.image = image;
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

    public EmotionType getEmotionType() {
        return emotionType;
    }

    public void setEmotionType(EmotionType emotionType) {
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