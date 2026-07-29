package com.example.syllabus.repositories;

import com.example.syllabus.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Optional<User> findByUsernameOrEmail(String username, String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    Optional<User> findByLeetCodeUsername(String leetCodeUsername);

    List<User> findByLeetCodeUsernameIsNotNull();

    @Query("SELECT u FROM User u ORDER BY u.xp DESC, u.totalSolved DESC")
    Page<User> findGlobalLeaderboard(Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.id IN :ids ORDER BY u.xp DESC, u.totalSolved DESC")
    List<User> findUsersByIdsOrderedByXp(List<Long> ids);
}
