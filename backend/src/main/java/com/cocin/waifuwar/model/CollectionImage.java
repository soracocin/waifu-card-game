package com.cocin.waifuwar.model;

import com.cocin.waifuwar.dto.DialogueItem;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

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

    @Column(nullable = false)
    private String imageUrl;

    // JSON field cho dialogues
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "dialogues", columnDefinition = "jsonb")
    private List<DialogueItem> dialogues = new ArrayList<>();

    public CollectionImage() {}
    public CollectionImage(CardCollection collection, String imageUrl, List<DialogueItem> dialogues) {
        this.collection = collection;
        this.imageUrl = imageUrl;
        this.dialogues = dialogues;
    }
    // All Getters and setters
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
    public List<DialogueItem> getDialogues() {
        return dialogues;
    }
    public void setDialogues(List<DialogueItem> dialogues) {
        this.dialogues = dialogues;
    }
}

