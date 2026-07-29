package com.example.syllabus.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class LeetCodeService {

    private static final String LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public static class LeetCodeStats {
        private boolean valid;
        private String username;
        private int easySolved = 0;
        private int mediumSolved = 0;
        private int hardSolved = 0;
        private int totalSolved = 0;

        public boolean isValid() {
            return valid;
        }

        public void setValid(boolean valid) {
            this.valid = valid;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public int getEasySolved() {
            return easySolved;
        }

        public void setEasySolved(int easySolved) {
            this.easySolved = easySolved;
        }

        public int getMediumSolved() {
            return mediumSolved;
        }

        public void setMediumSolved(int mediumSolved) {
            this.mediumSolved = mediumSolved;
        }

        public int getHardSolved() {
            return hardSolved;
        }

        public void setHardSolved(int hardSolved) {
            this.hardSolved = hardSolved;
        }

        public int getTotalSolved() {
            return totalSolved;
        }

        public void setTotalSolved(int totalSolved) {
            this.totalSolved = totalSolved;
        }
    }

    public LeetCodeStats fetchLeetCodeStats(String username) {
        LeetCodeStats stats = new LeetCodeStats();
        stats.setUsername(username);

        try {
            String graphqlQuery = "query userPublicProfile($username: String!) {\n" +
                    "  matchedUser(username: $username) {\n" +
                    "    username\n" +
                    "    submitStats {\n" +
                    "      acSubmissionNum {\n" +
                    "        difficulty\n" +
                    "        count\n" +
                    "      }\n" +
                    "    }\n" +
                    "  }\n" +
                    "}";

            Map<String, Object> body = new HashMap<>();
            body.put("query", graphqlQuery);

            Map<String, String> variables = new HashMap<>();
            variables.put("username", username);
            body.put("variables", variables);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(LEETCODE_GRAPHQL_URL, requestEntity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode rootNode = objectMapper.readTree(response.getBody());
                JsonNode matchedUserNode = rootNode.path("data").path("matchedUser");

                if (matchedUserNode.isMissingNode() || matchedUserNode.isNull()) {
                    stats.setValid(false);
                    return stats;
                }

                stats.setValid(true);
                JsonNode acSubmissionsNode = matchedUserNode.path("submitStats").path("acSubmissionNum");

                if (acSubmissionsNode.isArray()) {
                    for (JsonNode item : acSubmissionsNode) {
                        String difficulty = item.path("difficulty").asText();
                        int count = item.path("count").asInt(0);

                        if ("Easy".equalsIgnoreCase(difficulty)) {
                            stats.setEasySolved(count);
                        } else if ("Medium".equalsIgnoreCase(difficulty)) {
                            stats.setMediumSolved(count);
                        } else if ("Hard".equalsIgnoreCase(difficulty)) {
                            stats.setHardSolved(count);
                        } else if ("All".equalsIgnoreCase(difficulty)) {
                            stats.setTotalSolved(count);
                        }
                    }
                }

                if (stats.getTotalSolved() == 0) {
                    stats.setTotalSolved(stats.getEasySolved() + stats.getMediumSolved() + stats.getHardSolved());
                }
            } else {
                stats.setValid(false);
            }
        } catch (Exception e) {
            stats.setValid(false);
        }

        return stats;
    }
}
