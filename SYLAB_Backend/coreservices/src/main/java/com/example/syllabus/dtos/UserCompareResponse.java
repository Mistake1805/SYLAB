package com.example.syllabus.dtos;

public class UserCompareResponse {

    private LeaderboardEntryResponse userA;
    private LeaderboardEntryResponse userB;

    public UserCompareResponse() {
    }

    public UserCompareResponse(LeaderboardEntryResponse userA, LeaderboardEntryResponse userB) {
        this.userA = userA;
        this.userB = userB;
    }

    public LeaderboardEntryResponse getUserA() {
        return userA;
    }

    public void setUserA(LeaderboardEntryResponse userA) {
        this.userA = userA;
    }

    public LeaderboardEntryResponse getUserB() {
        return userB;
    }

    public void setUserB(LeaderboardEntryResponse userB) {
        this.userB = userB;
    }
}
