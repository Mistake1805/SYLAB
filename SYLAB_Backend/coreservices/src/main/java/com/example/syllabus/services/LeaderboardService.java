package com.example.syllabus.services;

import com.example.syllabus.dtos.LeaderboardEntryResponse;
import com.example.syllabus.models.Friendship;
import com.example.syllabus.models.FriendshipStatus;
import com.example.syllabus.models.User;
import com.example.syllabus.repositories.FriendshipRepository;
import com.example.syllabus.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaderboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FriendshipRepository friendshipRepository;

    public List<LeaderboardEntryResponse> getGlobalLeaderboard(int page, int limit) {
        Pageable pageable = PageRequest.of(Math.max(0, page - 1), Math.max(1, limit));
        Page<User> userPage = userRepository.findGlobalLeaderboard(pageable);

        List<User> content = userPage.getContent();
        List<LeaderboardEntryResponse> result = new ArrayList<>();
        int startingRank = (pageable.getPageNumber() * pageable.getPageSize()) + 1;

        for (int i = 0; i < content.size(); i++) {
            User u = content.get(i);
            result.add(mapToEntry(u, startingRank + i));
        }

        return result;
    }

    public List<LeaderboardEntryResponse> getFriendsLeaderboard(User currentUser) {
        List<Friendship> friendships = friendshipRepository.findAllFriendshipsForUser(currentUser, FriendshipStatus.ACCEPTED);
        
        List<Long> friendIds = new ArrayList<>();
        friendIds.add(currentUser.getId()); // Include currentUser in friends leaderboard

        for (Friendship f : friendships) {
            if (f.getRequester().getId().equals(currentUser.getId())) {
                friendIds.add(f.getAddressee().getId());
            } else {
                friendIds.add(f.getRequester().getId());
            }
        }

        List<User> friendUsers = userRepository.findUsersByIdsOrderedByXp(friendIds);
        List<LeaderboardEntryResponse> result = new ArrayList<>();

        for (int i = 0; i < friendUsers.size(); i++) {
            User u = friendUsers.get(i);
            result.add(mapToEntry(u, i + 1));
        }

        return result;
    }

    private LeaderboardEntryResponse mapToEntry(User user, int rank) {
        return new LeaderboardEntryResponse(
                user.getId(),
                user.getUsername(),
                user.getLeetCodeUsername(),
                rank,
                user.getXp(),
                user.getStreak(),
                user.getEasySolved(),
                user.getMediumSolved(),
                user.getHardSolved(),
                user.getTotalSolved()
        );
    }
}
