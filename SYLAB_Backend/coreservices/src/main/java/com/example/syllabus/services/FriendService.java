package com.example.syllabus.services;

import com.example.syllabus.dtos.FriendDTO;
import com.example.syllabus.dtos.LeaderboardEntryResponse;
import com.example.syllabus.models.Friendship;
import com.example.syllabus.models.FriendshipStatus;
import com.example.syllabus.models.User;
import com.example.syllabus.repositories.FriendshipRepository;
import com.example.syllabus.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FriendService {

    @Autowired
    private FriendshipRepository friendshipRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public FriendDTO sendFriendRequest(User requester, Long targetUserId) {
        if (requester.getId().equals(targetUserId)) {
            throw new IllegalArgumentException("Cannot send a friend request to yourself");
        }

        User addressee = userRepository.findById(targetUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + targetUserId));

        Optional<Friendship> existing = friendshipRepository.findFriendshipBetween(requester, addressee);
        if (existing.isPresent()) {
            throw new IllegalStateException("Friendship or request already exists between users");
        }

        Friendship friendship = new Friendship(requester, addressee, FriendshipStatus.PENDING);
        Friendship saved = friendshipRepository.save(friendship);

        return mapToDTO(saved, requester);
    }

    @Transactional
    public FriendDTO acceptFriendRequest(User currentUser, Long requestId) {
        Friendship friendship = friendshipRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Friend request not found"));

        if (!friendship.getAddressee().getId().equals(currentUser.getId())) {
            throw new IllegalStateException("You are not authorized to accept this friend request");
        }

        friendship.setStatus(FriendshipStatus.ACCEPTED);
        Friendship saved = friendshipRepository.save(friendship);

        return mapToDTO(saved, currentUser);
    }

    public List<FriendDTO> listFriends(User currentUser) {
        List<Friendship> friendships = friendshipRepository.findAllFriendshipsForUser(currentUser, FriendshipStatus.ACCEPTED);
        List<FriendDTO> result = new ArrayList<>();
        for (Friendship f : friendships) {
            result.add(mapToDTO(f, currentUser));
        }
        return result;
    }

    @Transactional
    public boolean removeFriend(User currentUser, Long targetUserId) {
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + targetUserId));

        Optional<Friendship> friendship = friendshipRepository.findFriendshipBetween(currentUser, targetUser);
        if (friendship.isPresent()) {
            friendshipRepository.delete(friendship.get());
            return true;
        }
        return false;
    }

    private FriendDTO mapToDTO(Friendship friendship, User currentUser) {
        User friendUser = friendship.getRequester().getId().equals(currentUser.getId())
                ? friendship.getAddressee()
                : friendship.getRequester();

        LeaderboardEntryResponse entry = new LeaderboardEntryResponse(
                friendUser.getId(),
                friendUser.getUsername(),
                friendUser.getLeetCodeUsername(),
                friendUser.getRank(),
                friendUser.getXp(),
                friendUser.getStreak(),
                friendUser.getEasySolved(),
                friendUser.getMediumSolved(),
                friendUser.getHardSolved(),
                friendUser.getTotalSolved()
        );

        return new FriendDTO(
                friendship.getId(),
                entry,
                friendship.getStatus().name(),
                friendship.getCreatedAt()
        );
    }
}
