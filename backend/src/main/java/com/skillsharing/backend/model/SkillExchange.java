package com.skillsharing.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "skillExchange")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SkillExchange {
    @Id
    private String id;
    private String userId;
    private String username;
    private String userProfile;
    private String skillOffered;
    private String skillRequested;
    private String description;
    private String exchangeDate;
    private String preferredMode;
    private String location;
    private String contactInfo;

}

