package com.skillsharing.backend.DTO;

import lombok.Data;

import java.util.List;

@Data
public class UserDTO {
    private String id;
    private String name;
    private String firstName;
    private String lastName;
    private String email;
    private String profileImage;
    private String mobileNumber;
    private String source;
    private List<String> followedUsers;
    private List<String> followingUsers;
    private int followersCount;
    private int followingCount;
}
