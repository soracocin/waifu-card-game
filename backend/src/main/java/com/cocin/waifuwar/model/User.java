package com.cocin.waifuwar.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(min = 3, max = 50)
    @Column(unique = true)
    private String username;

    @NotBlank
    @Email
    @Size(max = 100)
    @Column(unique = true)
    private String email;

    @NotBlank
    @Size(min = 6, max = 255)
    private String passwordHash;

    @Column(columnDefinition = "INTEGER DEFAULT 1000")
    private Integer coins = 1000;

    @Column(columnDefinition = "INTEGER DEFAULT 100")
    private Integer gems = 100;

    @Column(columnDefinition = "INTEGER DEFAULT 0")
    private Integer experiencePoints = 0;

    @Column(columnDefinition = "INTEGER DEFAULT 1")
    private Integer level = 1;

    @Column
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column
    private LocalDateTime updatedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<UserCard> userCards = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Deck> decks = new HashSet<>();

    // Default constructor
    public User() {}

    // Constructor
    public User(String username, String email, String passwordHash) {
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public Integer getCoins() { return coins; }
    public void setCoins(Integer coins) { this.coins = coins; }

    public Integer getGems() { return gems; }
    public void setGems(Integer gems) { this.gems = gems; }

    public Integer getExperiencePoints() { return experiencePoints; }
    public void setExperiencePoints(Integer experiencePoints) { this.experiencePoints = experiencePoints; }

    public Integer getLevel() { return level; }
    public void setLevel(Integer level) { this.level = level; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Set<UserCard> getUserCards() { return userCards; }
    public void setUserCards(Set<UserCard> userCards) { this.userCards = userCards; }

    public Set<Deck> getDecks() { return decks; }
    public void setDecks(Set<Deck> decks) { this.decks = decks; }
}