package com.cocin.waifuwar.dto;

import com.cocin.waifuwar.model.User;

public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private Integer coins;
    private Integer gems;
    private Integer experiencePoints;
    private Integer level;
    private String createdAt;

    // Default constructor
    public UserDTO() {}

    // Constructor from entity
    public UserDTO(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.coins = user.getCoins();
        this.gems = user.getGems();
        this.experiencePoints = user.getExperiencePoints();
        this.level = user.getLevel();
        this.createdAt = user.getCreatedAt().toString();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Integer getCoins() { return coins; }
    public void setCoins(Integer coins) { this.coins = coins; }

    public Integer getGems() { return gems; }
    public void setGems(Integer gems) { this.gems = gems; }

    public Integer getExperiencePoints() { return experiencePoints; }
    public void setExperiencePoints(Integer experiencePoints) { this.experiencePoints = experiencePoints; }

    public Integer getLevel() { return level; }
    public void setLevel(Integer level) { this.level = level; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}