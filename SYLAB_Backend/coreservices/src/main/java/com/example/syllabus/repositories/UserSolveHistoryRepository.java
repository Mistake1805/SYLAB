package com.example.syllabus.repositories;

import com.example.syllabus.models.User;
import com.example.syllabus.models.UserSolveHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserSolveHistoryRepository extends JpaRepository<UserSolveHistory, Long> {

    List<UserSolveHistory> findByUserIdOrderByDateAsc(Long userId);

    Optional<UserSolveHistory> findByUserAndDate(User user, LocalDate date);
}
