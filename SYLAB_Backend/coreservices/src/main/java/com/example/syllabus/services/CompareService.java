package com.example.syllabus.services;

import com.example.syllabus.dtos.LeaderboardEntryResponse;
import com.example.syllabus.dtos.UserCompareResponse;
import com.example.syllabus.models.User;
import com.example.syllabus.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CompareService {

    @Autowired
    private UserRepository userRepository;

    public UserCompareResponse compareUsers(Long userIdA, Long userIdB) {
        User userA = userRepository.findById(userIdA)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userIdA));

        User userB = userRepository.findById(userIdB)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userIdB));

        LeaderboardEntryResponse entryA = mapToEntry(userA);
        LeaderboardEntryResponse entryB = mapToEntry(userB);

        return new UserCompareResponse(entryA, entryB);
    }

    private LeaderboardEntryResponse mapToEntry(User user) {
        return new LeaderboardEntryResponse(
                user.getId(),
                user.getUsername(),
                user.getLeetCodeUsername(),
                user.getRank(),
                user.getXp(),
                user.getStreak(),
                user.getEasySolved(),
                user.getMediumSolved(),
                user.getHardSolved(),
                user.getTotalSolved()
        );
    }
}
