package com.example.syllabus.services;

import com.example.syllabus.dtos.BadgeDTO;
import com.example.syllabus.models.Badge;
import com.example.syllabus.models.User;
import com.example.syllabus.models.UserBadge;
import com.example.syllabus.repositories.BadgeRepository;
import com.example.syllabus.repositories.UserBadgeRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BadgeService {

    @Autowired
    private BadgeRepository badgeRepository;

    @Autowired
    private UserBadgeRepository userBadgeRepository;

    @PostConstruct
    public void seedDefaultBadges() {
        if (badgeRepository.count() == 0) {
            badgeRepository.save(new Badge("FIRST_SOLVE", "First Step", "Solved 1+ LeetCode problem", "badge_first_solve.png", 50, 1));
            badgeRepository.save(new Badge("CENTURION", "Centurion", "Solved 100+ LeetCode problems", "badge_centurion.png", 200, 100));
            badgeRepository.save(new Badge("MASTER_CODER", "Master Coder", "Solved 500+ LeetCode problems", "badge_master.png", 1000, 500));
            badgeRepository.save(new Badge("STREAK_7", "Weekly Warrior", "Achieved a 7-day solve streak", "badge_streak_7.png", 150, 0));
            badgeRepository.save(new Badge("STREAK_30", "Monthly Legend", "Achieved a 30-day solve streak", "badge_streak_30.png", 500, 0));
        }
    }

    public List<BadgeDTO> getAllBadges() {
        List<Badge> badges = badgeRepository.findAll();
        return badges.stream()
                .map(b -> new BadgeDTO(b.getId(), b.getCode(), b.getName(), b.getDescription(), b.getIconUrl(), b.getXpBonus(), b.getRequiredSolved(), false, null))
                .collect(Collectors.toList());
    }

    public List<BadgeDTO> getUserBadges(Long userId) {
        List<Badge> allBadges = badgeRepository.findAll();
        List<UserBadge> earnedUserBadges = userBadgeRepository.findByUserId(userId);

        Map<Long, UserBadge> earnedMap = earnedUserBadges.stream()
                .collect(Collectors.toMap(ub -> ub.getBadge().getId(), ub -> ub));

        return allBadges.stream().map(b -> {
            boolean earned = earnedMap.containsKey(b.getId());
            return new BadgeDTO(
                    b.getId(),
                    b.getCode(),
                    b.getName(),
                    b.getDescription(),
                    b.getIconUrl(),
                    b.getXpBonus(),
                    b.getRequiredSolved(),
                    earned,
                    earned ? earnedMap.get(b.getId()).getEarnedAt() : null
            );
        }).collect(Collectors.toList());
    }

    @Transactional
    public void evaluateAndAwardBadges(User user) {
        List<Badge> allBadges = badgeRepository.findAll();
        for (Badge badge : allBadges) {
            boolean alreadyEarned = userBadgeRepository.existsByUserAndBadge(user, badge);
            if (alreadyEarned) {
                continue;
            }

            boolean qualify = false;
            if (badge.getRequiredSolved() > 0 && user.getTotalSolved() >= badge.getRequiredSolved()) {
                qualify = true;
            }
            if ("STREAK_7".equalsIgnoreCase(badge.getCode()) && user.getStreak() >= 7) {
                qualify = true;
            }
            if ("STREAK_30".equalsIgnoreCase(badge.getCode()) && user.getStreak() >= 30) {
                qualify = true;
            }

            if (qualify) {
                UserBadge userBadge = new UserBadge(user, badge);
                userBadgeRepository.save(userBadge);
                user.setXp(user.getXp() + badge.getXpBonus());
            }
        }
    }
}
