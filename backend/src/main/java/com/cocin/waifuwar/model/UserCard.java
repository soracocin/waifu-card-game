package com.cocin.waifuwar.model;import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_cards")
public class UserCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "card_id", nullable = false)
    private Card card;

    @Column(columnDefinition = "INTEGER DEFAULT 1")
    private Integer level = 1;

    @Column(columnDefinition = "INTEGER DEFAULT 0")
    private Integer experience = 0;

    @Column
    private LocalDateTime obtainedAt = LocalDateTime.now();

    // Default constructor
    public UserCard() {}

    // Constructor
    public UserCard(User user, Card card) {
        this.user = user;
        this.card = card;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Card getCard() { return card; }
    public void setCard(Card card) { this.card = card; }

    public Integer getLevel() { return level; }
    public void setLevel(Integer level) { this.level = level; }

    public Integer getExperience() { return experience; }
    public void setExperience(Integer experience) { this.experience = experience; }

    public LocalDateTime getObtainedAt() { return obtainedAt; }
    public void setObtainedAt(LocalDateTime obtainedAt) { this.obtainedAt = obtainedAt; }
}