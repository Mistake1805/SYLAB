package com.example.syllabus.services;

import com.example.syllabus.models.User;
import com.example.syllabus.models.UserSolveHistory;
import com.example.syllabus.repositories.UserRepository;
import com.example.syllabus.repositories.UserSolveHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class SyncService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserSolveHistoryRepository historyRepository;

    @Autowired
    private LeetCodeService leetCodeService;

    @Autowired
    private BadgeService badgeService;

    @Value("${app.sync.internal-secret}")
    private String internalSecret;

    public void validateInternalSecret(String headerSecret) {
        if (headerSecret == null || !headerSecret.equals(internalSecret)) {
            throw new SecurityException("Unauthorized: Invalid internal sync secret key");
        }
    }

    @Transactional
    public User syncUserStats(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        if (user.getLeetCodeUsername() == null || user.getLeetCodeUsername().isBlank()) {
            throw new IllegalStateException("User does not have a linked LeetCode account");
        }

        LeetCodeService.LeetCodeStats stats = leetCodeService.fetchLeetCodeStats(user.getLeetCodeUsername());
        if (!stats.isValid()) {
            return user;
        }

        int previousTotal = user.getTotalSolved();
        int newEasy = stats.getEasySolved();
        int newMedium = stats.getMediumSolved();
        int newHard = stats.getHardSolved();
        int newTotal = stats.getTotalSolved();

        int easyDiff = Math.max(0, newEasy - user.getEasySolved());
        int mediumDiff = Math.max(0, newMedium - user.getMediumSolved());
        int hardDiff = Math.max(0, newHard - user.getHardSolved());
        int xpGained = (easyDiff * 10) + (mediumDiff * 20) + (hardDiff * 30);

        user.setEasySolved(newEasy);
        user.setMediumSolved(newMedium);
        user.setHardSolved(newHard);
        user.setTotalSolved(newTotal);
        user.setXp(user.getXp() + xpGained);

        if (newTotal > previousTotal) {
            user.setStreak(user.getStreak() + 1);
        }

        User savedUser = userRepository.save(user);

        // Update Daily History Snapshot
        LocalDate today = LocalDate.now();
        UserSolveHistory history = historyRepository.findByUserAndDate(savedUser, today)
                .orElseGet(() -> new UserSolveHistory(savedUser, today, 0, 0, 0, 0, 0));

        history.setEasyCount(newEasy);
        history.setMediumCount(newMedium);
        history.setHardCount(newHard);
        history.setTotalSolved(newTotal);
        history.setXpEarned(history.getXpEarned() + xpGained);
        historyRepository.save(history);

        // Check & Award Badges
        badgeService.evaluateAndAwardBadges(savedUser);

        // Update global rankings
        updateGlobalRanks();

        return savedUser;
    }

    @Transactional
    public int syncAllUsers() {
        List<User> linkedUsers = userRepository.findByLeetCodeUsernameIsNotNull();
        int count = 0;
        for (User user : linkedUsers) {
            try {
                syncUserStats(user.getId());
                count++;
            } catch (Exception e) {
                // Log and continue with next user
            }
        }
        updateGlobalRanks();
        return count;
    }

    private void updateGlobalRanks() {
        List<User> users = userRepository.findAll();
        users.sort((a, b) -> {
            int xpCompare = Integer.compare(b.getXp(), a.getXp());
            if (xpCompare != 0) return xpCompare;
            return Integer.compare(b.getTotalSolved(), a.getTotalSolved());
        });

        for (int i = 0; i < users.size(); i++) {
            users.get(i).setRank(i + 1);
        }
        userRepository.saveAll(users);
    }
}
