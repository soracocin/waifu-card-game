package com.cocin.waifuwar.repository;

import com.cocin.waifuwar.model.CollectionImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CollectionImageRepository extends JpaRepository<CollectionImage, Long> {
    
    // Find all images by collection id
    List<CollectionImage> findByCollectionIdOrderByOrderIndexAsc(Long collectionId);
    
    // Find images by collection id with dialogues
    @Query("SELECT DISTINCT i FROM CollectionImage i " +
           "LEFT JOIN FETCH i.dialogues d " +
           "WHERE i.collection.id = :collectionId " +
           "ORDER BY i.orderIndex ASC, d.orderIndex ASC")
    List<CollectionImage> findByCollectionIdWithDialogues(@Param("collectionId") Long collectionId);
    
    // Find image by id with dialogues
    @Query("SELECT DISTINCT i FROM CollectionImage i " +
           "LEFT JOIN FETCH i.dialogues " +
           "WHERE i.id = :id")
    CollectionImage findByIdWithDialogues(@Param("id") Long id);
    
    // Count images by collection id
    long countByCollectionId(Long collectionId);
    
    // Find images by title containing (case insensitive)
    @Query("SELECT i FROM CollectionImage i " +
           "WHERE i.collection.id = :collectionId " +
           "AND LOWER(i.title) LIKE LOWER(CONCAT('%', :title, '%')) " +
           "ORDER BY i.orderIndex ASC")
    List<CollectionImage> findByCollectionIdAndTitleContainingIgnoreCase(
            @Param("collectionId") Long collectionId, 
            @Param("title") String title);
            
    // Delete all images by collection id
    void deleteByCollectionId(Long collectionId);
    
    // Find images by multiple collection ids
    @Query("SELECT i FROM CollectionImage i WHERE i.collection.id IN :collectionIds ORDER BY i.collection.id, i.orderIndex ASC")
    List<CollectionImage> findByCollectionIdIn(@Param("collectionIds") List<Long> collectionIds);
}