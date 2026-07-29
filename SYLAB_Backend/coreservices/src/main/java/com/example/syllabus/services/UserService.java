package com.example.syllabus.services;

import com.example.syllabus.dtos.*;
import com.example.syllabus.models.User;
import com.example.syllabus.models.UserSolveHistory;
import com.example.syllabus.repositories.UserRepository;
import com.example.syllabus.repositories.UserSolveHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserSolveHistoryRepository historyRepository;

    @Autowired
    private LeetCodeService leetCodeService;

    @Autowired
    private BadgeService badgeService;

    public UserProfileResponse getPublicProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        List<BadgeDTO> badges = badgeService.getUserBadges(userId);

        UserProfileResponse response = new UserProfileResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setBio(user.getBio());
        response.setLeetCodeUsername(user.getLeetCodeUsername());
        response.setXp(user.getXp());
        response.setRank(user.getRank());
        response.setStreak(user.getStreak());
        response.setEasySolved(user.getEasySolved());
        response.setMediumSolved(user.getMediumSolved());
        response.setHardSolved(user.getHardSolved());
        response.setTotalSolved(user.getTotalSolved());
        response.setBadges(badges);

        return response;
    }

    @Transactional
    public UserProfileResponse updateProfile(User user, UpdateProfileRequest request) {
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        
        // If the request contains a LeetCode username, process the sync logic
        if (request.getLeetCodeUsername() != null && !request.getLeetCodeUsername().isBlank()) {
            String lcUsername = request.getLeetCodeUsername().trim();
            LeetCodeService.LeetCodeStats stats = leetCodeService.fetchLeetCodeStats(lcUsername);
            if (!stats.isValid()) {
                throw new IllegalArgumentException("LeetCode username '" + lcUsername + "' does not exist or could not be verified");
            }
            user.setLeetCodeUsername(stats.getUsername());
            user.setEasySolved(stats.getEasySolved());
            user.setMediumSolved(stats.getMediumSolved());
            user.setHardSolved(stats.getHardSolved());
            user.setTotalSolved(stats.getTotalSolved());

            int xp = (stats.getEasySolved() * 10) + (stats.getMediumSolved() * 20) + (stats.getHardSolved() * 30);
            user.setXp(xp);
            
            // Save and award badges instantly
            userRepository.save(user);
            badgeService.evaluateAndAwardBadges(user);
        } else {
            userRepository.save(user);
        }
        
        return getPublicProfile(user.getId());
    }

    @Transactional
    public UserProfileResponse linkLeetCode(User user, LinkLeetCodeRequest request) {
        String lcUsername = request.getLeetCodeUsername().trim();

        LeetCodeService.LeetCodeStats stats = leetCodeService.fetchLeetCodeStats(lcUsername);
        if (!stats.isValid()) {
            throw new IllegalArgumentException("LeetCode username '" + lcUsername + "' does not exist or could not be verified on LeetCode");
        }

        user.setLeetCodeUsername(stats.getUsername());
        user.setEasySolved(stats.getEasySolved());
        user.setMediumSolved(stats.getMediumSolved());
        user.setHardSolved(stats.getHardSolved());
        user.setTotalSolved(stats.getTotalSolved());

        // Calculate XP (e.g. Easy=10XP, Medium=20XP, Hard=30XP)
        int xp = (stats.getEasySolved() * 10) + (stats.getMediumSolved() * 20) + (stats.getHardSolved() * 30);
        user.setXp(xp);

        User saved = userRepository.save(user);

        // Check for awarded badges
        badgeService.evaluateAndAwardBadges(saved);

        return getPublicProfile(saved.getId());
    }

    @Transactional
    public UserProfileResponse unlinkLeetCode(User user) {
        user.setLeetCodeUsername(null);
        User saved = userRepository.save(user);
        return getPublicProfile(saved.getId());
    }

    public UserStatsResponse getUserStats(User user) {
        return new UserStatsResponse(
                user.getXp(),
                user.getRank(),
                user.getStreak(),
                user.getEasySolved(),
                user.getMediumSolved(),
                user.getHardSolved(),
                user.getTotalSolved()
        );
    }

    public List<UserSolveHistoryDTO> getUserHistory(Long userId) {
        List<UserSolveHistory> historyList = historyRepository.findByUserIdOrderByDateAsc(userId);
        return historyList.stream()
                .map(h -> new UserSolveHistoryDTO(
                        h.getDate(),
                        h.getEasyCount(),
                        h.getMediumCount(),
                        h.getHardCount(),
                        h.getTotalSolved(),
                        h.getXpEarned()
                ))
                .collect(Collectors.toList());
    }
}
