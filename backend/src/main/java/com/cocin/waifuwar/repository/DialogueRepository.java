package com.cocin.waifuwar.repository;

import com.cocin.waifuwar.model.Dialogue;
import com.cocin.waifuwar.model.Dialogue.EmotionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DialogueRepository extends JpaRepository<Dialogue, Long> {
    
    // Find all dialogues by image id
    List<Dialogue> findByImageIdOrderByOrderIndexAsc(Long imageId);
    
    // Find dialogues by speaker
    List<Dialogue> findByImageIdAndSpeakerOrderByOrderIndexAsc(Long imageId, String speaker);
    
    // Find dialogues by emotion type
    List<Dialogue> findByImageIdAndEmotionTypeOrderByOrderIndexAsc(Long imageId, EmotionType emotionType);
    
    // Count dialogues by image id
    long countByImageId(Long imageId);
    
    // Find dialogues containing text (case insensitive)
    @Query("SELECT d FROM Dialogue d " +
           "WHERE d.image.id = :imageId " +
           "AND LOWER(d.text) LIKE LOWER(CONCAT('%', :text, '%')) " +
           "ORDER BY d.orderIndex ASC")
    List<Dialogue> findByImageIdAndTextContainingIgnoreCase(
            @Param("imageId") Long imageId, 
            @Param("text") String text);
    
    // Delete all dialogues by image id
    void deleteByImageId(Long imageId);
    
    // Find dialogues by multiple image ids
    @Query("SELECT d FROM Dialogue d WHERE d.image.id IN :imageIds ORDER BY d.image.id, d.orderIndex ASC")
    List<Dialogue> findByImageIdIn(@Param("imageIds") List<Long> imageIds);
    
    // Find all unique speakers for an image
    @Query("SELECT DISTINCT d.speaker FROM Dialogue d WHERE d.image.id = :imageId AND d.speaker IS NOT NULL")
    List<String> findDistinctSpeakersByImageId(@Param("imageId") Long imageId);
    
    // Find dialogues by order index range
    @Query("SELECT d FROM Dialogue d " +
           "WHERE d.image.id = :imageId " +
           "AND d.orderIndex BETWEEN :startIndex AND :endIndex " +
           "ORDER BY d.orderIndex ASC")
    List<Dialogue> findByImageIdAndOrderIndexBetween(
            @Param("imageId") Long imageId, 
            @Param("startIndex") Integer startIndex, 
            @Param("endIndex") Integer endIndex);
}