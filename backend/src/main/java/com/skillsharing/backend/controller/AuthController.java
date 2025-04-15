package com.skillsharing.backend.controller;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.skillsharing.backend.model.RegistrationSource;
import com.skillsharing.backend.model.User;
import com.skillsharing.backend.service.UserService;

@Controller
public class AuthController {
    @Autowired
    private UserService userService;
    @GetMapping("/")
    public String home(@AuthenticationPrincipal OAuth2User principal) {
        System.out.println("/looooo" + principal);
        return "redirect:http://localhost:3000";
    }

    @GetMapping("/api/user")
    @ResponseBody
    public ResponseEntity<Object> getUsername(@AuthenticationPrincipal OAuth2User principal) {
        if (principal != null) {
            String name = principal.getAttribute("name");
            String email = principal.getAttribute("email");
            String picture = principal.getAttribute("picture");

            String[] nameParts = name.split(" ", 2);
            String firstName = nameParts.length > 0 ? nameParts[0] : "";
            String lastName = nameParts.length > 1 ? nameParts[1] : "";

            User user = new User();
            user.setEmail(email);
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setName(name);
            user.setProfileImage(picture);
            user.setSource(RegistrationSource.GOOGLE);

            return userService.createUser(user);
        } else {
            return ResponseEntity.status(Response.SC_UNAUTHORIZED).build();
        }
    }
}