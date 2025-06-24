package com.cocin.waifuwar.repository;
import com.cocin.waifuwar.model.Battle;
import com.cocin.waifuwar.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BattleRepository extends JpaRepository<Battle, Long> {

    List<Battle> findByPlayer1OrPlayer2(User player1, User player2);

    List<Battle> findByStatus(Battle.BattleStatus status);

    @Query("SELECT b FROM Battle b WHERE b.status = 'WAITING' ORDER BY b.startedAt ASC")
    List<Battle> findWaitingBattles();

    @Query("SELECT b FROM Battle b WHERE (b.player1.id = :userId OR b.player2.id = :userId) " +
            "AND b.status = 'IN_PROGRESS'")
    Optional<Battle> findActiveUserBattle(@Param("userId") Long userId);

    @Query("SELECT b FROM Battle b WHERE (b.player1.id = :userId OR b.player2.id = :userId) " +
            "ORDER BY b.startedAt DESC")
    List<Battle> findUserBattleHistory(@Param("userId") Long userId);

    @Query("SELECT COUNT(b) FROM Battle b WHERE b.winner.id = :userId")
    long countUserWins(@Param("userId") Long userId);

    @Query("SELECT COUNT(b) FROM Battle b WHERE (b.player1.id = :userId OR b.player2.id = :userId) " +
            "AND b.status = 'FINISHED'")
    long countUserTotalBattles(@Param("userId") Long userId);
}
