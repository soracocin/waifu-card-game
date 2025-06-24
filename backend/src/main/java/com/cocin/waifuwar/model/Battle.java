package com.cocin.waifuwar.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "battles")
public class Battle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player1_id", nullable = false)
    private User player1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player2_id", nullable = false)
    private User player2;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "winner_id")
    private User winner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player1_deck_id", nullable = false)
    private Deck player1Deck;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player2_deck_id", nullable = false)
    private Deck player2Deck;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BattleStatus status = BattleStatus.WAITING;

    @Column(columnDefinition = "JSONB")
    private String battleData;

    @Column
    private LocalDateTime startedAt = LocalDateTime.now();

    @Column
    private LocalDateTime finishedAt;

    // Enum
    public enum BattleStatus {
        WAITING, IN_PROGRESS, FINISHED, CANCELLED
    }

    // Default constructor
    public Battle() {}

    // Constructor
    public Battle(User player1, User player2, Deck player1Deck, Deck player2Deck) {
        this.player1 = player1;
        this.player2 = player2;
        this.player1Deck = player1Deck;
        this.player2Deck = player2Deck;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getPlayer1() { return player1; }
    public void setPlayer1(User player1) { this.player1 = player1; }

    public User getPlayer2() { return player2; }
    public void setPlayer2(User player2) { this.player2 = player2; }

    public User getWinner() { return winner; }
    public void setWinner(User winner) { this.winner = winner; }

    public Deck getPlayer1Deck() { return player1Deck; }
    public void setPlayer1Deck(Deck player1Deck) { this.player1Deck = player1Deck; }

    public Deck getPlayer2Deck() { return player2Deck; }
    public void setPlayer2Deck(Deck player2Deck) { this.player2Deck = player2Deck; }

    public BattleStatus getStatus() { return status; }
    public void setStatus(BattleStatus status) { this.status = status; }

    public String getBattleData() { return battleData; }
    public void setBattleData(String battleData) { this.battleData = battleData; }

    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }

    public LocalDateTime getFinishedAt() { return finishedAt; }
    public void setFinishedAt(LocalDateTime finishedAt) { this.finishedAt = finishedAt; }
}
