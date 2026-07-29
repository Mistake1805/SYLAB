package com.example.syllabus.repositories;

import com.example.syllabus.models.Friendship;
import com.example.syllabus.models.FriendshipStatus;
import com.example.syllabus.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Long> {

    @Query("SELECT f FROM Friendship f WHERE (f.requester = :user OR f.addressee = :user) AND f.status = :status")
    List<Friendship> findAllFriendshipsForUser(User user, FriendshipStatus status);

    @Query("SELECT f FROM Friendship f WHERE (f.requester = :user1 AND f.addressee = :user2) OR (f.requester = :user2 AND f.addressee = :user1)")
    Optional<Friendship> findFriendshipBetween(User user1, User user2);

    List<Friendship> findByAddresseeAndStatus(User addressee, FriendshipStatus status);
}
