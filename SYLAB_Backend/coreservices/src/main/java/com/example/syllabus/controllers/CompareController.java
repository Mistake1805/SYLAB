package com.example.syllabus.controllers;

import com.example.syllabus.dtos.UserCompareResponse;
import com.example.syllabus.services.CompareService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/compare")
public class CompareController {

    @Autowired
    private CompareService compareService;

    @GetMapping("/{userIdA}/{userIdB}")
    public ResponseEntity<UserCompareResponse> compareUsers(
            @PathVariable Long userIdA,
            @PathVariable Long userIdB) {
        UserCompareResponse response = compareService.compareUsers(userIdA, userIdB);
        return ResponseEntity.ok(response);
    }
}
