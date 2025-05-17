package com.skillsharing.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "progress")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Progress {
    @Id
    private String progressId;

    private String userId;
    private String username;
    private String userProfile;

    private String milestone;
    private String description;
    private String progressDate;

    // Additional fields
    private String skillCategory;
    private int completionPercentage;
    private String learningResources;
}
