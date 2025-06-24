package com.cocin.waifuwar.controller;
import com.cocin.waifuwar.dto.CardDTO;
import com.cocin.waifuwar.service.CardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cards")
@CrossOrigin(origins = "http://localhost:3000")
public class CardController {

    @Autowired
    private CardService cardService;

    @GetMapping
    public ResponseEntity<List<CardDTO>> getAllCards() {
        List<CardDTO> cards = cardService.getAllCards();
        return ResponseEntity.ok(cards);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CardDTO> getCard(@PathVariable Long id) {
        CardDTO card = cardService.getCard(id);
        return ResponseEntity.ok(card);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CardDTO>> getUserCards(@PathVariable Long userId) {
        List<CardDTO> cards = cardService.getUserCards(userId);
        return ResponseEntity.ok(cards);
    }

    @GetMapping("/rarity/{rarity}")
    public ResponseEntity<List<CardDTO>> getCardsByRarity(@PathVariable String rarity) {
        List<CardDTO> cards = cardService.getCardsByRarity(rarity);
        return ResponseEntity.ok(cards);
    }

    @GetMapping("/element/{element}")
    public ResponseEntity<List<CardDTO>> getCardsByElement(@PathVariable String element) {
        List<CardDTO> cards = cardService.getCardsByElement(element);
        return ResponseEntity.ok(cards);
    }
}