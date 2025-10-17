package com.cocin.waifuwar.service;

import com.cocin.waifuwar.dto.DialogueItemDTO;
import com.cocin.waifuwar.model.CollectionImage;
import com.cocin.waifuwar.model.Dialogue;
import com.cocin.waifuwar.model.Dialogue.EmotionType;
import com.cocin.waifuwar.repository.CollectionImageRepository;
import com.cocin.waifuwar.repository.DialogueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class DialogueService {

    @Autowired
    private DialogueRepository dialogueRepository;
    
    @Autowired
    private CollectionImageRepository imageRepository;

    // Dialogue CRUD operations
    public DialogueItemDTO createDialogue(DialogueItemDTO dto) {
        Optional<CollectionImage> image = imageRepository.findById(dto.getImageId());
        if (image.isEmpty()) {
            throw new RuntimeException("Image not found with id: " + dto.getImageId());
        }
        
        Dialogue dialogue = new Dialogue();
        dialogue.setImage(image.get());
        dialogue.setText(dto.getText());
        dialogue.setSpeaker(dto.getSpeaker());
        
        // Parse emotion type
        if (dto.getEmotionType() != null) {
            try {
                EmotionType emotionType = EmotionType.valueOf(dto.getEmotionType().toUpperCase());
                dialogue.setEmotionType(emotionType);
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid emotion type: " + dto.getEmotionType());
            }
        }
        
        // Set order index as the next available position
        long count = dialogueRepository.countByImageId(dto.getImageId());
        dialogue.setOrderIndex((int) count);
        
        Dialogue saved = dialogueRepository.save(dialogue);
        return convertToDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<DialogueItemDTO> getDialoguesByImageId(Long imageId) {
        List<Dialogue> dialogues = dialogueRepository.findByImageIdOrderByOrderIndexAsc(imageId);
        return dialogues.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DialogueItemDTO getDialogueById(Long id) {
        Dialogue dialogue = dialogueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dialogue not found with id: " + id));
        return convertToDTO(dialogue);
    }

    public DialogueItemDTO updateDialogue(Long id, DialogueItemDTO dto) {
        Dialogue dialogue = dialogueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dialogue not found with id: " + id));
        
        dialogue.setText(dto.getText());
        dialogue.setSpeaker(dto.getSpeaker());
        
        // Parse emotion type
        if (dto.getEmotionType() != null) {
            try {
                EmotionType emotionType = EmotionType.valueOf(dto.getEmotionType().toUpperCase());
                dialogue.setEmotionType(emotionType);
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid emotion type: " + dto.getEmotionType());
            }
        }
        
        if (dto.getOrderIndex() != null) {
            dialogue.setOrderIndex(dto.getOrderIndex());
        }
        
        Dialogue updated = dialogueRepository.save(dialogue);
        return convertToDTO(updated);
    }

    public void deleteDialogue(Long id) {
        if (!dialogueRepository.existsById(id)) {
            throw new RuntimeException("Dialogue not found with id: " + id);
        }
        dialogueRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<DialogueItemDTO> searchDialogues(Long imageId, String text, String speaker, String emotionType) {
        List<Dialogue> dialogues;
        
        if (text != null && !text.trim().isEmpty()) {
            dialogues = dialogueRepository.findByImageIdAndTextContainingIgnoreCase(imageId, text);
        } else if (speaker != null && !speaker.trim().isEmpty()) {
            dialogues = dialogueRepository.findByImageIdAndSpeakerOrderByOrderIndexAsc(imageId, speaker);
        } else if (emotionType != null && !emotionType.trim().isEmpty()) {
            try {
                EmotionType emotion = EmotionType.valueOf(emotionType.toUpperCase());
                dialogues = dialogueRepository.findByImageIdAndEmotionTypeOrderByOrderIndexAsc(imageId, emotion);
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid emotion type: " + emotionType);
            }
        } else {
            dialogues = dialogueRepository.findByImageIdOrderByOrderIndexAsc(imageId);
        }
        
        return dialogues.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<String> getUniqueSpeakers(Long imageId) {
        return dialogueRepository.findDistinctSpeakersByImageId(imageId);
    }

    public void reorderDialogues(Long imageId, List<Long> dialogueIdsInOrder) {
        List<Dialogue> dialogues = dialogueRepository.findByImageIdOrderByOrderIndexAsc(imageId);
        
        for (int i = 0; i < dialogueIdsInOrder.size(); i++) {
            Long dialogueId = dialogueIdsInOrder.get(i);
            Dialogue dialogue = dialogues.stream()
                    .filter(d -> d.getId().equals(dialogueId))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Dialogue not found with id: " + dialogueId));
            
            dialogue.setOrderIndex(i);
            dialogueRepository.save(dialogue);
        }
    }

    @Transactional(readOnly = true)
    public List<DialogueItemDTO> getDialoguesByOrderRange(Long imageId, Integer startIndex, Integer endIndex) {
        List<Dialogue> dialogues = dialogueRepository.findByImageIdAndOrderIndexBetween(imageId, startIndex, endIndex);
        return dialogues.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Helper method to convert entity to DTO
    private DialogueItemDTO convertToDTO(Dialogue dialogue) {
        return new DialogueItemDTO(
                dialogue.getId(),
                dialogue.getImage().getId(),
                dialogue.getText(),
                dialogue.getSpeaker(),
                dialogue.getOrderIndex(),
                dialogue.getEmotionType() != null ? dialogue.getEmotionType().toString() : null,
                dialogue.getCreatedAt(),
                dialogue.getUpdatedAt()
        );
    }
}