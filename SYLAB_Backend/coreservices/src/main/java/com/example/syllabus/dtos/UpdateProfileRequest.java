package com.example.syllabus.dtos;

public class UpdateProfileRequest {

    private String bio;

    public UpdateProfileRequest() {
    }

    public UpdateProfileRequest(String bio) {
        this.bio = bio;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }
}
