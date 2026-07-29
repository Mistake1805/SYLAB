package com.example.syllabus.dtos;

public class LeaderboardEntryResponse {

    private Long id;
    private String username;
    private String leetCodeUsername;
    private Integer rank;
    private Integer xp;
    private Integer streak;
    private Integer easySolved;
    private Integer mediumSolved;
    private Integer hardSolved;
    private Integer totalSolved;

    public LeaderboardEntryResponse() {
    }

    public LeaderboardEntryResponse(Long id, String username, String leetCodeUsername, Integer rank, Integer xp, Integer streak, Integer easySolved, Integer mediumSolved, Integer hardSolved, Integer totalSolved) {
        this.id = id;
        this.username = username;
        this.leetCodeUsername = leetCodeUsername;
        this.rank = rank;
        this.xp = xp;
        this.streak = streak;
        this.easySolved = easySolved;
        this.mediumSolved = mediumSolved;
        this.hardSolved = hardSolved;
        this.totalSolved = totalSolved;
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

    public String getLeetCodeUsername() {
        return leetCodeUsername;
    }

    public void setLeetCodeUsername(String leetCodeUsername) {
        this.leetCodeUsername = leetCodeUsername;
    }

    public Integer getRank() {
        return rank;
    }

    public void setRank(Integer rank) {
        this.rank = rank;
    }

    public Integer getXp() {
        return xp;
    }

    public void setXp(Integer xp) {
        this.xp = xp;
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
}
