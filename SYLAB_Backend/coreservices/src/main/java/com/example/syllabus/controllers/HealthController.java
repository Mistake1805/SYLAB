package com.example.syllabus.controllers;

import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public Map<String, String> checkHealth() {
        return Map.of("status", "UP", "timestamp", String.valueOf(System.currentTimeMillis()));
    }
}