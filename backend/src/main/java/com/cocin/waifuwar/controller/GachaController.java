package com.cocin.waifuwar.controller;
import com.cocin.waifuwar.dto.GachaResultDTO;
import com.cocin.waifuwar.service.GachaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/gacha")
@CrossOrigin(origins = "http://localhost:3000")
public class GachaController {

    @Autowired
    private GachaService gachaService;

    @PostMapping("/single/{userId}")
    public ResponseEntity<GachaResultDTO> performSinglePull(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "false") boolean useGems) {
        try {
            GachaResultDTO result = gachaService.performSinglePull(userId, useGems);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/ten/{userId}")
    public ResponseEntity<GachaResultDTO> performTenPull(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "false") boolean useGems) {
        try {
            GachaResultDTO result = gachaService.performTenPull(userId, useGems);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}