package com.example.syllabus.dtos;

import java.util.List;

public class UserProfileResponse {

    private Long id;
    private String username;
    private String email;
    private String bio;
    private String leetCodeUsername;
    private Integer xp;
    private Integer rank;
    private Integer streak;
    private Integer easySolved;
    private Integer mediumSolved;
    private Integer hardSolved;
    private Integer totalSolved;
    private List<BadgeDTO> badges;

    public UserProfileResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getLeetCodeUsername() {
        return leetCodeUsername;
    }

    public void setLeetCodeUsername(String leetCodeUsername) {
        this.leetCodeUsername = leetCodeUsername;
    }

    public Integer getXp() {
        return xp;
    }

    public void setXp(Integer xp) {
        this.xp = xp;
    }

    public Integer getRank() {
        return rank;
    }

    public void setRank(Integer rank) {
        this.rank = rank;
    }

    public Integer getStreak() {
        return streak;
    }

    public void setStreak(Integer streak) {
        this.streak = streak;
    }

    public Integer getEasySolved() {
        return easySolved;
    }

    public void setEasySolved(Integer easySolved) {
        this.easySolved = easySolved;
    }

    public Integer getMediumSolved() {
        return mediumSolved;
    }

    public void setMediumSolved(Integer mediumSolved) {
        this.mediumSolved = mediumSolved;
    }

    public Integer getHardSolved() {
        return hardSolved;
    }

    public void setHardSolved(Integer hardSolved) {
        this.hardSolved = hardSolved;
    }

    public Integer getTotalSolved() {
        return totalSolved;
    }

    public void setTotalSolved(Integer totalSolved) {
        this.totalSolved = totalSolved;
    }

    public List<BadgeDTO> getBadges() {
        return badges;
    }

    public void setBadges(List<BadgeDTO> badges) {
        this.badges = badges;
    }
}
