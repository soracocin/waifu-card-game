package com.cocin.waifuwar.repository;

import com.cocin.waifuwar.model.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CardRepository extends JpaRepository<Card, Long> {

    List<Card> findAllByIsActiveTrueOrderByNameAsc();

    List<Card> findByRarityAndIsActiveTrue(Card.Rarity rarity);

    List<Card> findByElementAndIsActiveTrue(Card.Element element);

    @Query(
            value = "SELECT * FROM cards WHERE is_active = true ORDER BY RANDOM() LIMIT :limit",
            nativeQuery = true
    )
    List<Card> findRandomActiveCards(@Param("limit") int limit);

    @Query(
            value = "SELECT * FROM cards WHERE rarity = :rarity AND is_active = true ORDER BY RANDOM() LIMIT :limit",
            nativeQuery = true
    )
    List<Card> findRandomCardsByRarity(@Param("rarity") String rarity, @Param("limit") int limit);
}
