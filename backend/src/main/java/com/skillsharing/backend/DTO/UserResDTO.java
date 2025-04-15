package com.skillsharing.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import com.skillsharing.backend.model.RegistrationSource;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserResDTO {

    private String id;

    private String name;

    private String firstName;

    private String lastName;

    private String email;

    private String profileImage;

    private RegistrationSource source;

    private List<String> followedUsers;
}
