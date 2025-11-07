package com.cocin.waifuwar.controller;

import com.cocin.waifuwar.dto.CardDTO;
import com.cocin.waifuwar.service.CardService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@Validated
@RequestMapping(value = "/api/cards", produces = MediaType.APPLICATION_JSON_VALUE)
@CrossOrigin(origins = "http://localhost:3000")
public class CardController {

    private final CardService cardService;

    public CardController(CardService cardService) {
        this.cardService = cardService;
    }

    @GetMapping
    public ResponseEntity<List<CardDTO>> getAllCards() {
        return ResponseEntity.ok(cardService.getAllCards());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CardDTO> getCard(@PathVariable Long id) {
        return ResponseEntity.ok(cardService.getCard(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CardDTO>> getUserCards(@PathVariable Long userId) {
        return ResponseEntity.ok(cardService.getUserCards(userId));
    }

    @GetMapping("/rarity/{rarity}")
    public ResponseEntity<List<CardDTO>> getCardsByRarity(@PathVariable String rarity) {
        return ResponseEntity.ok(cardService.getCardsByRarity(rarity));
    }

    @GetMapping("/element/{element}")
    public ResponseEntity<List<CardDTO>> getCardsByElement(@PathVariable String element) {
        return ResponseEntity.ok(cardService.getCardsByElement(element));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CardDTO> createCard(@RequestPart("card") @Valid CardDTO cardDTO,
                                              @RequestPart(value = "file", required = false) MultipartFile file) {
        CardDTO createdCard = cardService.createCard(cardDTO, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCard);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CardDTO> updateCard(@PathVariable Long id,
                                              @RequestPart("card") @Valid CardDTO cardDTO,
                                              @RequestPart(value = "file", required = false) MultipartFile file) {
        return ResponseEntity.ok(cardService.updateCard(id, cardDTO, file));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCard(@PathVariable Long id) {
        cardService.deleteCard(id);
        return ResponseEntity.noContent().build();
    }
}
