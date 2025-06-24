package com.cocin.waifuwar.dto;

import com.cocin.waifuwar.model.Card;

public class CardDTO {
    private Long id;
    private String name;
    private String description;
    private Integer attack;
    private Integer defense;
    private Integer cost;
    private String rarity;
    private String element;
    private String imageUrl;

    // Default constructor
    public CardDTO() {}

    // Constructor from entity
    public CardDTO(Card card) {
        this.id = card.getId();
        this.name = card.getName();
        this.description = card.getDescription();
        this.attack = card.getAttack();
        this.defense = card.getDefense();
        this.cost = card.getCost();
        this.rarity = card.getRarity().toString();
        this.element = card.getElement().toString();
        this.imageUrl = card.getImageUrl();
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

    public String getRarity() { return rarity; }
    public void setRarity(String rarity) { this.rarity = rarity; }

    public String getElement() { return element; }
    public void setElement(String element) { this.element = element; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}