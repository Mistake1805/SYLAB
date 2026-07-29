package com.example.syllabus.controllers;

import com.example.syllabus.dtos.LeaderboardEntryResponse;
import com.example.syllabus.models.User;
import com.example.syllabus.services.AuthService;
import com.example.syllabus.services.LeaderboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    @Autowired
    private LeaderboardService leaderboardService;

    @Autowired
    private AuthService authService;

    @GetMapping
    public ResponseEntity<List<LeaderboardEntryResponse>> getLeaderboard(
            @RequestParam(defaultValue = "global") String scope,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "50") int limit) {

        if ("friends".equalsIgnoreCase(scope)) {
            User currentUser = authService.getCurrentAuthenticatedUser();
            List<LeaderboardEntryResponse> friendsRanking = leaderboardService.getFriendsLeaderboard(currentUser);
            return ResponseEntity.ok(friendsRanking);
        }

        List<LeaderboardEntryResponse> globalRanking = leaderboardService.getGlobalLeaderboard(page, limit);
        return ResponseEntity.ok(globalRanking);
    }
}
