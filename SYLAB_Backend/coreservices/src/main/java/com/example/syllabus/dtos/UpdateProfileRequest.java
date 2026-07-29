package com.example.syllabus.dtos;

public class UpdateProfileRequest {

    private String bio;
    
    private String leetCodeUsername;

    public UpdateProfileRequest() {
    }

    public UpdateProfileRequest(String bio, String leetCodeUsername) {
        this.bio = bio;
        this.leetCodeUsername = leetCodeUsername;
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
}
