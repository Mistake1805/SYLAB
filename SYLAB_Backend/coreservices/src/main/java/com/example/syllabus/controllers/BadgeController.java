package com.example.syllabus.controllers;

import com.example.syllabus.dtos.BadgeDTO;
import com.example.syllabus.models.User;
import com.example.syllabus.services.AuthService;
import com.example.syllabus.services.BadgeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
public class BadgeController {

    @Autowired
    private BadgeService badgeService;

    @Autowired
    private AuthService authService;

    @GetMapping("/api/badges")
    public ResponseEntity<List<BadgeDTO>> getAllBadges() {
        List<BadgeDTO> badges = badgeService.getAllBadges();
        return ResponseEntity.ok(badges);
    }

    @GetMapping("/api/users/me/badges")
    public ResponseEntity<List<BadgeDTO>> getMyBadges() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        List<BadgeDTO> badges = badgeService.getUserBadges(currentUser.getId());
        return ResponseEntity.ok(badges);
    }
}
