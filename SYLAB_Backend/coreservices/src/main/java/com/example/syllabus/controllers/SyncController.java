package com.example.syllabus.controllers;

import com.example.syllabus.models.User;
import com.example.syllabus.services.SyncService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/sync")
public class SyncController {

    @Autowired
    private SyncService syncService;

    @PostMapping("/user/{id}")
    public ResponseEntity<?> syncUser(
            @PathVariable Long id,
            @RequestHeader(value = "X-Internal-Secret", required = false) String internalSecret) {
        
        syncService.validateInternalSecret(internalSecret);
        User user = syncService.syncUserStats(id);
        
        return ResponseEntity.ok(Map.of(
                "message", "User stats refreshed successfully",
                "userId", user.getId(),
                "leetCodeUsername", user.getLeetCodeUsername() != null ? user.getLeetCodeUsername() : "",
                "totalSolved", user.getTotalSolved(),
                "xp", user.getXp()
        ));
    }

    @PostMapping("/all")
    public ResponseEntity<?> syncAll(
            @RequestHeader(value = "X-Internal-Secret", required = false) String internalSecret) {

        syncService.validateInternalSecret(internalSecret);
        int syncedCount = syncService.syncAllUsers();

        return ResponseEntity.ok(Map.of(
                "message", "Batch refresh completed",
                "syncedUsersCount", syncedCount
        ));
    }
}
