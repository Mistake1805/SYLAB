package com.example.syllabus.dtos;

import java.time.LocalDateTime;

public class BadgeDTO {

    private Long id;
    private String code;
    private String name;
    private String description;
    private String iconUrl;
    private Integer xpBonus;
    private Integer requiredSolved;
    private Boolean earned = false;
    private LocalDateTime earnedAt;

    public BadgeDTO() {
    }

    public BadgeDTO(Long id, String code, String name, String description, String iconUrl, Integer xpBonus, Integer requiredSolved, Boolean earned, LocalDateTime earnedAt) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.description = description;
        this.iconUrl = iconUrl;
        this.xpBonus = xpBonus;
        this.requiredSolved = requiredSolved;
        this.earned = earned;
        this.earnedAt = earnedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIconUrl() {
        return iconUrl;
    }

    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
    }

    public Integer getXpBonus() {
        return xpBonus;
    }

    public void setXpBonus(Integer xpBonus) {
        this.xpBonus = xpBonus;
    }

    public Integer getRequiredSolved() {
        return requiredSolved;
    }

    public void setRequiredSolved(Integer requiredSolved) {
        this.requiredSolved = requiredSolved;
    }

    public Boolean getEarned() {
        return earned;
    }

    public void setEarned(Boolean earned) {
        this.earned = earned;
    }

    public LocalDateTime getEarnedAt() {
        return earnedAt;
    }

    public void setEarnedAt(LocalDateTime earnedAt) {
        this.earnedAt = earnedAt;
    }
}
