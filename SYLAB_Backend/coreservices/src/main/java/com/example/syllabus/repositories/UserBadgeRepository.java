package com.example.syllabus.repositories;

import com.example.syllabus.models.Badge;
import com.example.syllabus.models.User;
import com.example.syllabus.models.UserBadge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserBadgeRepository extends JpaRepository<UserBadge, Long> {

    List<UserBadge> findByUserId(Long userId);

    boolean existsByUserAndBadge(User user, Badge badge);

    Optional<UserBadge> findByUserAndBadge(User user, Badge badge);
}
