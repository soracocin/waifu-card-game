package com.cocin.waifuwar.repository;

import com.cocin.waifuwar.model.Deck;
import com.cocin.waifuwar.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
@Repository
public interface DeckRepository extends JpaRepository<Deck, Long> {

    List<Deck> findByUser(User user);

    List<Deck> findByUserId(Long userId);

    Optional<Deck> findByUserAndIsActiveTrue(User user);

    @Query("SELECT d FROM Deck d WHERE d.user.id = :userId AND d.isActive = true")
    Optional<Deck> findActiveUserDeck(@Param("userId") Long userId);

    @Query("SELECT COUNT(d) FROM Deck d WHERE d.user.id = :userId")
    long countUserDecks(@Param("userId") Long userId);
}