package com.cocin.waifuwar.repository;
import com.cocin.waifuwar.model.UserCard;
import com.cocin.waifuwar.model.User;
import com.cocin.waifuwar.model.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserCardRepository extends JpaRepository<UserCard, Long> {

    List<UserCard> findByUser(User user);

    List<UserCard> findByUserId(Long userId);

    Optional<UserCard> findByUserAndCard(User user, Card card);

    boolean existsByUserAndCard(User user, Card card);

    @Query("SELECT uc FROM UserCard uc WHERE uc.user.id = :userId ORDER BY uc.obtainedAt DESC")
    List<UserCard> findUserCardsOrderByObtainedDate(@Param("userId") Long userId);

    @Query("SELECT COUNT(uc) FROM UserCard uc WHERE uc.user.id = :userId")
    long countUserCards(@Param("userId") Long userId);
}
