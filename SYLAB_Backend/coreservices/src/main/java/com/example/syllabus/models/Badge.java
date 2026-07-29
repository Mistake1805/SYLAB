package com.example.syllabus.models;

import jakarta.persistence.*;

@Entity
@Table(name = "badges")
public class Badge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String name;

    private String description;

    private String iconUrl;

    private Integer xpBonus = 0;

    private Integer requiredSolved = 0;

    public Badge() {
    }

    public Badge(String code, String name, String description, String iconUrl, Integer xpBonus, Integer requiredSolved) {
        this.code = code;
        this.name = name;
        this.description = description;
        this.iconUrl = iconUrl;
        this.xpBonus = xpBonus;
        this.requiredSolved = requiredSolved;
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
}
