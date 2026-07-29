package com.example.syllabus.dtos;

import jakarta.validation.constraints.NotBlank;

public class LinkLeetCodeRequest {

    @NotBlank(message = "LeetCode username is required")
    private String leetCodeUsername;

    public LinkLeetCodeRequest() {
    }

    public LinkLeetCodeRequest(String leetCodeUsername) {
        this.leetCodeUsername = leetCodeUsername;
    }

    public String getLeetCodeUsername() {
        return leetCodeUsername;
    }

    public void setLeetCodeUsername(String leetCodeUsername) {
        this.leetCodeUsername = leetCodeUsername;
    }
}
