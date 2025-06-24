package com.cocin.waifuwar.dto;

import java.util.List;

public class BattleStateDTO {
    private Long battleId;
    private String status;
    private PlayerStateDTO player1;
    private PlayerStateDTO player2;
    private String currentTurn;
    private Integer turnTimeRemaining;
    private String lastAction;
    private String winner;

    public static class PlayerStateDTO {
        private Long playerId;
        private String username;
        private Integer health;
        private Integer mana;
        private List<CardDTO> hand;
        private List<CardDTO> battlefield;

        // Constructors
        public PlayerStateDTO() {}

        public PlayerStateDTO(Long playerId, String username, Integer health, Integer mana) {
            this.playerId = playerId;
            this.username = username;
            this.health = health;
            this.mana = mana;
        }

        // Getters and Setters
        public Long getPlayerId() { return playerId; }
        public void setPlayerId(Long playerId) { this.playerId = playerId; }

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public Integer getHealth() { return health; }
        public void setHealth(Integer health) { this.health = health; }

        public Integer getMana() { return mana; }
        public void setMana(Integer mana) { this.mana = mana; }

        public List<CardDTO> getHand() { return hand; }
        public void setHand(List<CardDTO> hand) { this.hand = hand; }

        public List<CardDTO> getBattlefield() { return battlefield; }
        public void setBattlefield(List<CardDTO> battlefield) { this.battlefield = battlefield; }
    }

    // Default constructor
    public BattleStateDTO() {}

    // Getters and Setters
    public Long getBattleId() { return battleId; }
    public void setBattleId(Long battleId) { this.battleId = battleId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public PlayerStateDTO getPlayer1() { return player1; }
    public void setPlayer1(PlayerStateDTO player1) { this.player1 = player1; }

    public PlayerStateDTO getPlayer2() { return player2; }
    public void setPlayer2(PlayerStateDTO player2) { this.player2 = player2; }

    public String getCurrentTurn() { return currentTurn; }
    public void setCurrentTurn(String currentTurn) { this.currentTurn = currentTurn; }

    public Integer getTurnTimeRemaining() { return turnTimeRemaining; }
    public void setTurnTimeRemaining(Integer turnTimeRemaining) { this.turnTimeRemaining = turnTimeRemaining; }

    public String getLastAction() { return lastAction; }
    public void setLastAction(String lastAction) { this.lastAction = lastAction; }

    public String getWinner() { return winner; }
    public void setWinner(String winner) { this.winner = winner; }
}