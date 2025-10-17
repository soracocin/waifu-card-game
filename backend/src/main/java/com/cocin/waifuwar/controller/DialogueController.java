package com.cocin.waifuwar.controller;

import com.cocin.waifuwar.dto.DialogueItemDTO;
import com.cocin.waifuwar.service.DialogueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class DialogueController {

    @Autowired
    private DialogueService dialogueService;

    // Get all dialogues for an image
    @GetMapping("/images/{imageId}/dialogues")
    public ResponseEntity<List<DialogueItemDTO>> getDialoguesByImageId(@PathVariable Long imageId) {
        try {
            List<DialogueItemDTO> dialogues = dialogueService.getDialoguesByImageId(imageId);
            return ResponseEntity.ok(dialogues);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Create a new dialogue for an image
    @PostMapping("/images/{imageId}/dialogues")
    public ResponseEntity<?> createDialogue(@PathVariable Long imageId,
                                          @Valid @RequestBody DialogueItemDTO dto) {
        try {
            dto.setImageId(imageId); // Ensure imageId matches path parameter
            DialogueItemDTO created = dialogueService.createDialogue(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An unexpected error occurred"));
        }
    }

    // Get dialogue details by ID
    @GetMapping("/dialogues/{dialogueId}")
    public ResponseEntity<?> getDialogueById(@PathVariable Long dialogueId) {
        try {
            DialogueItemDTO dialogue = dialogueService.getDialogueById(dialogueId);
            return ResponseEntity.ok(dialogue);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An unexpected error occurred"));
        }
    }

    // Update dialogue
    @PutMapping("/dialogues/{dialogueId}")
    public ResponseEntity<?> updateDialogue(@PathVariable Long dialogueId,
                                          @Valid @RequestBody DialogueItemDTO dto) {
        try {
            DialogueItemDTO updated = dialogueService.updateDialogue(dialogueId, dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An unexpected error occurred"));
        }
    }

    // Delete dialogue
    @DeleteMapping("/dialogues/{dialogueId}")
    public ResponseEntity<?> deleteDialogue(@PathVariable Long dialogueId) {
        try {
            dialogueService.deleteDialogue(dialogueId);
            return ResponseEntity.ok(Map.of("message", "Dialogue deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An unexpected error occurred"));
        }
    }

    // Search dialogues with multiple criteria
    @GetMapping("/images/{imageId}/dialogues/search")
    public ResponseEntity<List<DialogueItemDTO>> searchDialogues(@PathVariable Long imageId,
                                                               @RequestParam(required = false) String text,
                                                               @RequestParam(required = false) String speaker,
                                                               @RequestParam(required = false) String emotionType) {
        try {
            List<DialogueItemDTO> dialogues = dialogueService.searchDialogues(imageId, text, speaker, emotionType);
            return ResponseEntity.ok(dialogues);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get unique speakers for an image
    @GetMapping("/images/{imageId}/speakers")
    public ResponseEntity<List<String>> getUniqueSpeakers(@PathVariable Long imageId) {
        try {
            List<String> speakers = dialogueService.getUniqueSpeakers(imageId);
            return ResponseEntity.ok(speakers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Reorder dialogues within an image
    @PatchMapping("/images/{imageId}/reorder-dialogues")
    public ResponseEntity<?> reorderDialogues(@PathVariable Long imageId,
                                            @RequestBody Map<String, List<Long>> request) {
        try {
            List<Long> dialogueIdsInOrder = request.get("dialogueIds");
            if (dialogueIdsInOrder == null || dialogueIdsInOrder.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "dialogueIds array is required"));
            }
            
            dialogueService.reorderDialogues(imageId, dialogueIdsInOrder);
            return ResponseEntity.ok(Map.of("message", "Dialogues reordered successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An unexpected error occurred"));
        }
    }

    // Get dialogues by order range
    @GetMapping("/images/{imageId}/dialogues/range")
    public ResponseEntity<List<DialogueItemDTO>> getDialoguesByOrderRange(@PathVariable Long imageId,
                                                                        @RequestParam Integer startIndex,
                                                                        @RequestParam Integer endIndex) {
        try {
            List<DialogueItemDTO> dialogues = dialogueService.getDialoguesByOrderRange(imageId, startIndex, endIndex);
            return ResponseEntity.ok(dialogues);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}