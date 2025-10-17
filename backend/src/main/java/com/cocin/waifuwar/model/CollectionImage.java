package com.cocin.waifuwar.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "collection_images")
public class CollectionImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collection_id", nullable = false)
    private CardCollection collection;

    @NotBlank
    @Column(nullable = false)
    private String imageUrl;

    @Size(max = 200)
    @Column
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column
    private Integer orderIndex = 0;

    @Column
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column
    private LocalDateTime updatedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "image", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("orderIndex ASC")
    private List<Dialogue> dialogues = new ArrayList<>();

    // Constructors
    public CollectionImage() {}

    public CollectionImage(CardCollection collection, String imageUrl, String title, String description) {
        this.collection = collection;
        this.imageUrl = imageUrl;
        this.title = title;
        this.description = description;
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

    public CardCollection getCollection() {
        return collection;
    }

    public void setCollection(CardCollection collection) {
        this.collection = collection;
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

    public List<Dialogue> getDialogues() {
        return dialogues;
    }

    public void setDialogues(List<Dialogue> dialogues) {
        this.dialogues = dialogues;
    }

    // Helper methods
    public void addDialogue(Dialogue dialogue) {
        dialogues.add(dialogue);
        dialogue.setImage(this);
    }

    public void removeDialogue(Dialogue dialogue) {
        dialogues.remove(dialogue);
        dialogue.setImage(null);
    }
}