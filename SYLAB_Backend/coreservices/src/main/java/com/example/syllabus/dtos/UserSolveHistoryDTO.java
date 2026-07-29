package com.example.syllabus.dtos;

import java.time.LocalDate;

public class UserSolveHistoryDTO {

    private LocalDate date;
    private Integer easyCount;
    private Integer mediumCount;
    private Integer hardCount;
    private Integer totalSolved;
    private Integer xpEarned;

    public UserSolveHistoryDTO() {
    }

    public UserSolveHistoryDTO(LocalDate date, Integer easyCount, Integer mediumCount, Integer hardCount, Integer totalSolved, Integer xpEarned) {
        this.date = date;
        this.easyCount = easyCount;
        this.mediumCount = mediumCount;
        this.hardCount = hardCount;
        this.totalSolved = totalSolved;
        this.xpEarned = xpEarned;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Integer getEasyCount() {
        return easyCount;
    }

    public void setEasyCount(Integer easyCount) {
        this.easyCount = easyCount;
    }

    public Integer getMediumCount() {
        return mediumCount;
    }

    public void setMediumCount(Integer mediumCount) {
        this.mediumCount = mediumCount;
    }

    public Integer getHardCount() {
        return hardCount;
    }

    public void setHardCount(Integer hardCount) {
        this.hardCount = hardCount;
    }

    public Integer getTotalSolved() {
        return totalSolved;
    }

    public void setTotalSolved(Integer totalSolved) {
        this.totalSolved = totalSolved;
    }

    public Integer getXpEarned() {
        return xpEarned;
    }

    public void setXpEarned(Integer xpEarned) {
        this.xpEarned = xpEarned;
    }
}
