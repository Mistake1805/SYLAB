package com.example.syllabus.dtos;

import java.time.LocalDateTime;

public class FriendDTO {

    private Long id; // Friendship ID
    private LeaderboardEntryResponse friendUser;
    private String status;
    private LocalDateTime createdAt;

    public FriendDTO() {
    }

    public FriendDTO(Long id, LeaderboardEntryResponse friendUser, String status, LocalDateTime createdAt) {
        this.id = id;
        this.friendUser = friendUser;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LeaderboardEntryResponse getFriendUser() {
        return friendUser;
    }

    public void setFriendUser(LeaderboardEntryResponse friendUser) {
        this.friendUser = friendUser;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
