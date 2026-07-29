package com.example.syllabus.controllers;

import com.example.syllabus.dtos.FriendDTO;
import com.example.syllabus.models.User;
import com.example.syllabus.services.AuthService;
import com.example.syllabus.services.FriendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/friends")
public class FriendController {

    @Autowired
    private FriendService friendService;

    @Autowired
    private AuthService authService;

    @PostMapping("/request/{userId}")
    public ResponseEntity<FriendDTO> sendFriendRequest(@PathVariable Long userId) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        FriendDTO result = friendService.sendFriendRequest(currentUser, userId);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/accept/{requestId}")
    public ResponseEntity<FriendDTO> acceptFriendRequest(@PathVariable Long requestId) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        FriendDTO result = friendService.acceptFriendRequest(currentUser, requestId);
        return ResponseEntity.ok(result);
    }

    @GetMapping
    public ResponseEntity<List<FriendDTO>> getFriends() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        List<FriendDTO> friends = friendService.listFriends(currentUser);
        return ResponseEntity.ok(friends);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Map<String, String>> removeFriend(@PathVariable Long userId) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        boolean removed = friendService.removeFriend(currentUser, userId);
        if (removed) {
            return ResponseEntity.ok(Map.of("message", "Friend removed successfully"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Friend connection not found"));
        }
    }
}
