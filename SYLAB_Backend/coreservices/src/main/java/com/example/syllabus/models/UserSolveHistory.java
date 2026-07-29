package com.example.syllabus.models;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "user_solve_histories", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "solve_date"})
})
public class UserSolveHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "solve_date", nullable = false)
    private LocalDate date;

    private Integer easyCount = 0;

    private Integer mediumCount = 0;

    private Integer hardCount = 0;

    private Integer totalSolved = 0;

    private Integer xpEarned = 0;

    public UserSolveHistory() {
    }

    public UserSolveHistory(User user, LocalDate date, Integer easyCount, Integer mediumCount, Integer hardCount, Integer totalSolved, Integer xpEarned) {
        this.user = user;
        this.date = date;
        this.easyCount = easyCount;
        this.mediumCount = mediumCount;
        this.hardCount = hardCount;
        this.totalSolved = totalSolved;
        this.xpEarned = xpEarned;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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
