package com.cocin.waifuwar.repository;

import com.cocin.waifuwar.model.Card;
import com.cocin.waifuwar.model.CardCollection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CardCollectionRepository extends JpaRepository<CardCollection, Long> {

    // ============ BASIC QUERIES ============

    List<CardCollection> findByCard(Card card);

    List<CardCollection> findByCardId(Long cardId);

    Optional<CardCollection> findByName(String name);

    List<CardCollection> findByNameContainingIgnoreCase(String keyword);

    boolean existsByCardIdAndName(Long cardId, String name);

    // ============ COMPLEX QUERIES WITH @Query ============

    @Query("SELECT cc FROM CardCollection cc WHERE SIZE(cc.images) >= :minImages")
    List<CardCollection> findCollectionsWithMinImages(@Param("minImages") int minImages);

    @Query("SELECT cc FROM CardCollection cc WHERE SIZE(cc.images) > 0")
    List<CardCollection> findCollectionsWithImages();

    @Query("SELECT cc FROM CardCollection cc WHERE SIZE(cc.images) = 0")
    List<CardCollection> findCollectionsWithoutImages();

    @Query("SELECT cc FROM CardCollection cc WHERE cc.card.rarity = :rarity")
    List<CardCollection> findByCardRarity(@Param("rarity") Card.Rarity rarity);

    @Query("SELECT cc FROM CardCollection cc WHERE cc.card.element = :element")
    List<CardCollection> findByCardElement(@Param("element") Card.Element element);

    @Query("SELECT cc FROM CardCollection cc WHERE cc.card.isActive = :isActive")
    List<CardCollection> findByCardActiveStatus(@Param("isActive") Boolean isActive);

    // ============ ADVANCED QUERIES ============

    @Query("SELECT cc FROM CardCollection cc WHERE cc.card.attack >= :minAttack")
    List<CardCollection> findByCardMinAttack(@Param("minAttack") Integer minAttack);

    @Query("SELECT cc FROM CardCollection cc WHERE " +
            "(:cardName IS NULL OR cc.card.name ILIKE %:cardName%) AND " +
            "(:collectionName IS NULL OR cc.name ILIKE %:collectionName%) AND " +
            "(:rarity IS NULL OR cc.card.rarity = :rarity) AND " +
            "(:element IS NULL OR cc.card.element = :element)")
    Page<CardCollection> searchCollections(
            @Param("cardName") String cardName,
            @Param("collectionName") String collectionName,
            @Param("rarity") Card.Rarity rarity,
            @Param("element") Card.Element element,
            Pageable pageable
    );

    @Query(value = "SELECT cc.* FROM card_collections cc " +
            "LEFT JOIN collection_images ci ON cc.id = ci.collection_id " +
            "GROUP BY cc.id " +
            "ORDER BY COUNT(ci.id) DESC",
            nativeQuery = true)
    Page<CardCollection> findTopCollectionsByImageCount(Pageable pageable);

    // ============ FETCH JOINS ============

    @Query("SELECT cc FROM CardCollection cc " +
            "LEFT JOIN FETCH cc.images " +
            "WHERE cc.id = :id")
    Optional<CardCollection> findByIdWithImages(@Param("id") Long id);

    @Query("SELECT DISTINCT cc FROM CardCollection cc " +
            "LEFT JOIN FETCH cc.images ci " +
            "LEFT JOIN FETCH ci.dialogues " +
            "WHERE cc.id = :id")
    Optional<CardCollection> findByIdWithImagesAndDialogues(@Param("id") Long id);

    @Query("SELECT cc FROM CardCollection cc " +
            "LEFT JOIN FETCH cc.images " +
            "WHERE cc.card.id = :cardId")
    List<CardCollection> findByCardIdWithImages(@Param("cardId") Long cardId);

    @Query("SELECT cc FROM CardCollection cc " +
            "LEFT JOIN FETCH cc.card " +
            "LEFT JOIN FETCH cc.images " +
            "WHERE cc.id = :id")
    Optional<CardCollection> findByIdWithCardAndImages(@Param("id") Long id);

    // ============ STATISTICS QUERIES ============
    long countByCardId(Long cardId);

    @Query("SELECT COUNT(cc) FROM CardCollection cc WHERE cc.card.rarity = :rarity")
    long countByRarity(@Param("rarity") Card.Rarity rarity);

    @Query(value = "SELECT c.* FROM cards c " +
            "JOIN card_collections cc ON c.id = cc.card_id " +
            "GROUP BY c.id " +
            "ORDER BY COUNT(cc.id) DESC " +
            "LIMIT 1",
            nativeQuery = true)
    Optional<Card> findCardWithMostCollections();

    // ============ DELETION QUERIES ============

    void deleteByCardId(Long cardId);

    @Query("DELETE FROM CardCollection cc WHERE SIZE(cc.images) = 0")
    void deleteCollectionsWithoutImages();
}
