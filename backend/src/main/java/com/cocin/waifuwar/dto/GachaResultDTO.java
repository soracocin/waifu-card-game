package com.cocin.waifuwar.dto;

import java.util.List;

public class GachaResultDTO {
    private List<CardDTO> cards;
    private Integer totalCost;
    private String pullType;
    private Integer remainingCoins;
    private Integer remainingGems;

    // Default constructor
    public GachaResultDTO() {}

    // Constructor
    public GachaResultDTO(List<CardDTO> cards, Integer totalCost, String pullType,
                          Integer remainingCoins, Integer remainingGems) {
        this.cards = cards;
        this.totalCost = totalCost;
        this.pullType = pullType;
        this.remainingCoins = remainingCoins;
        this.remainingGems = remainingGems;
    }

    // Getters and Setters
    public List<CardDTO> getCards() { return cards; }
    public void setCards(List<CardDTO> cards) { this.cards = cards; }

    public Integer getTotalCost() { return totalCost; }
    public void setTotalCost(Integer totalCost) { this.totalCost = totalCost; }

    public String getPullType() { return pullType; }
    public void setPullType(String pullType) { this.pullType = pullType; }

    public Integer getRemainingCoins() { return remainingCoins; }
    public void setRemainingCoins(Integer remainingCoins) { this.remainingCoins = remainingCoins; }

    public Integer getRemainingGems() { return remainingGems; }
    public void setRemainingGems(Integer remainingGems) { this.remainingGems = remainingGems; }
}
