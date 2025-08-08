package com.cocin.waifuwar.model;
import jakarta.persistence.*;
import java.util.List;
import com.cocin.waifuwar.model.CollectionImage;

@Entity
@Table(name = "card_collections")
public class CardCollection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "card_id", nullable = false)
    private Card card;

    @Column(nullable = false)
    private String name;

    @OneToMany(mappedBy = "collection", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CollectionImage> images;

    public CardCollection() {}
    public CardCollection(Card card, String name, List<CollectionImage> images) {
        this.card = card;
        this.name = name;
        this.images = images;
    }
    // Getters and setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Card getCard() {
        return card;
    }
    public void setCard(Card card) {
        this.card = card;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public List<CollectionImage> getImages() {
        return images;
    }
    public void setImages(List<CollectionImage> images) {
        this.images = images;
    }
}
