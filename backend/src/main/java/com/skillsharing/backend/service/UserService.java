package com.skillsharing.backend.service;

import org.springframework.http.ResponseEntity;

import com.skillsharing.backend.DTO.UserDTO;
import com.skillsharing.backend.model.User;

import java.util.List;

public interface UserService {
    ResponseEntity<Object> createUser(User user);
    UserDTO getUserById(String userId);
    List<UserDTO> getAllUsers();
    ResponseEntity<Object> followUser(String userId, String followedUserId);

    ResponseEntity<Object> loginUser(String email, String password);
}
