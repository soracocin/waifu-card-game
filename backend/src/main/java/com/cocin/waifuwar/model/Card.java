package com.cocin.waifuwar.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "cards")
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Min(1)
    @Column(nullable = false)
    private Integer attack;

    @Min(0)
    @Column(nullable = false)
    private Integer defense;

    @Min(1)
    @Column(nullable = false)
    private Integer cost;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rarity rarity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Element element;

    @Column
    private String imageUrl;

    @Column(columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean isActive = true;

    @Column
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "card", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<UserCard> userCards = new HashSet<>();

    // Enums
    public enum Rarity {
        COMMON, RARE, EPIC, LEGENDARY
    }

    public enum Element {
        FIRE, WATER, EARTH, AIR, LIGHT, DARK
    }

    // Default constructor
    public Card() {}

    // Constructor
    public Card(String name, String description, Integer attack, Integer defense,
                Integer cost, Rarity rarity, Element element, String imageUrl) {
        this.name = name;
        this.description = description;
        this.attack = attack;
        this.defense = defense;
        this.cost = cost;
        this.rarity = rarity;
        this.element = element;
        this.imageUrl = imageUrl;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getAttack() { return attack; }
    public void setAttack(Integer attack) { this.attack = attack; }

    public Integer getDefense() { return defense; }
    public void setDefense(Integer defense) { this.defense = defense; }

    public Integer getCost() { return cost; }
    public void setCost(Integer cost) { this.cost = cost; }

    public Rarity getRarity() { return rarity; }
    public void setRarity(Rarity rarity) { this.rarity = rarity; }

    public Element getElement() { return element; }
    public void setElement(Element element) { this.element = element; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Set<UserCard> getUserCards() { return userCards; }
    public void setUserCards(Set<UserCard> userCards) { this.userCards = userCards; }
}