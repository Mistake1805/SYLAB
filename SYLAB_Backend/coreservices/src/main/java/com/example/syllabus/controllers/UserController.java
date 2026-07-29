package com.example.syllabus.controllers;

import com.example.syllabus.dtos.*;
import com.example.syllabus.models.User;
import com.example.syllabus.services.AuthService;
import com.example.syllabus.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;

    @GetMapping("/{id}")
    public ResponseEntity<UserProfileResponse> getPublicProfile(@PathVariable Long id) {
        UserProfileResponse profile = userService.getPublicProfile(id);
        return ResponseEntity.ok(profile);
    }

    @PatchMapping("/me")
    public ResponseEntity<UserProfileResponse> updateProfile(@RequestBody UpdateProfileRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        UserProfileResponse updated = userService.updateProfile(currentUser, request);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/me/leetcode")
    public ResponseEntity<UserProfileResponse> linkLeetCode(@Valid @RequestBody LinkLeetCodeRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        UserProfileResponse updated = userService.linkLeetCode(currentUser, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/me/leetcode")
    public ResponseEntity<UserProfileResponse> unlinkLeetCode() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        UserProfileResponse updated = userService.unlinkLeetCode(currentUser);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/me/stats")
    public ResponseEntity<UserStatsResponse> getOwnStats() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        UserStatsResponse stats = userService.getUserStats(currentUser);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<UserSolveHistoryDTO>> getUserHistory(@PathVariable Long id) {
        List<UserSolveHistoryDTO> history = userService.getUserHistory(id);
        return ResponseEntity.ok(history);
    }
}
