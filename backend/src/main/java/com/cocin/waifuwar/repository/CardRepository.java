package com.cocin.waifuwar.repository;
import com.cocin.waifuwar.model.Card;
import com.cocin.waifuwar.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CardRepository extends JpaRepository<Card, Long> {

    List<Card> findByRarity(Card.Rarity rarity);

    List<Card> findByElement(Card.Element element);

    List<Card> findByIsActiveTrue();

    @Query("SELECT c FROM Card c WHERE c.isActive = true ORDER BY RANDOM() LIMIT :limit")
    List<Card> findRandomActiveCards(@Param("limit") int limit);

    @Query("SELECT c FROM Card c WHERE c.rarity = :rarity AND c.isActive = true ORDER BY RANDOM() LIMIT :limit")
    List<Card> findRandomCardsByRarity(@Param("rarity") Card.Rarity rarity, @Param("limit") int limit);
}