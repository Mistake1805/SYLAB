package com.example.syllabus.dtos;

public class UserStatsResponse {

    private Integer xp;
    private Integer rank;
    private Integer streak;
    private Integer easySolved;
    private Integer mediumSolved;
    private Integer hardSolved;
    private Integer totalSolved;

    public UserStatsResponse() {
    }

    public UserStatsResponse(Integer xp, Integer rank, Integer streak, Integer easySolved, Integer mediumSolved, Integer hardSolved, Integer totalSolved) {
        this.xp = xp;
        this.rank = rank;
        this.streak = streak;
        this.easySolved = easySolved;
        this.mediumSolved = mediumSolved;
        this.hardSolved = hardSolved;
        this.totalSolved = totalSolved;
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
}
