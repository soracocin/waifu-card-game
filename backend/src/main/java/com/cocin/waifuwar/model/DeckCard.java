package com.cocin.waifuwar.model;
import jakarta.persistence.*;

@Entity
@Table(name = "deck_cards")
public class DeckCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deck_id", nullable = false)
    private Deck deck;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "card_id", nullable = false)
    private Card card;

    @Column(nullable = false)
    private Integer position;

    // Default constructor
    public DeckCard() {}

    // Constructor
    public DeckCard(Deck deck, Card card, Integer position) {
        this.deck = deck;
        this.card = card;
        this.position = position;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Deck getDeck() { return deck; }
    public void setDeck(Deck deck) { this.deck = deck; }

    public Card getCard() { return card; }
    public void setCard(Card card) { this.card = card; }

    public Integer getPosition() { return position; }
    public void setPosition(Integer position) { this.position = position; }
}