package com.skillsharing.backend.controller;

import org.springframework.beans.factory.annotation.Autowired; // Imports the @Autowired annotation for dependency injection.
import org.springframework.http.HttpStatus; // Imports HTTP status codes to be used in HTTP responses.
import org.springframework.http.ResponseEntity; // Imports the ResponseEntity class for sending HTTP responses.
import org.springframework.web.bind.annotation.*; // Imports annotations for defining REST endpoints.

import com.skillsharing.backend.DTO.CommentDTO; // Imports a Data Transfer Object (DTO) for comment data.
import com.skillsharing.backend.model.Comment; // Imports the Comment model class.
import com.skillsharing.backend.service.CommentService; // Imports the service class for handling comment-related business logic.

import java.util.List; // Imports the List class for storing collections of comments.

@RestController // Indicates that this class is a REST controller.
@RequestMapping("/posts/{postId}/comments") // Specifies the base URL mapping for endpoints in this controller.

public class CommentController { // Begins the CommentController class definition

    @Autowired // Injects the CommentService instance to be used within this controller.
    private CommentService commentService;

    @GetMapping // Maps HTTP GET requests to the following method.
    public ResponseEntity<List<Comment>> getCommentsForPost(@PathVariable String postId) { // Defines a method to get comments for a specific post
        List<Comment> comments = commentService.getCommentsForPost(postId); // Retrieves a list of comments for a given post ID.
        return new ResponseEntity<>(comments, HttpStatus.OK); // Returns the list of comments with an HTTP 200 OK status.
    }

    @PostMapping // Maps HTTP POST requests to the following method.
    public ResponseEntity<Comment> addCommentToPost(@PathVariable String postId, @RequestBody CommentDTO request) { // Defines a method to add a comment to a specific post
        Comment comment = commentService.addCommentToPost(postId, request.getContent(), request.getCommentBy(), request.getCommentById(), request.getCommentByProfile());
        // Adds a comment to the given post using details from the CommentDTO.
        return new ResponseEntity<>(comment, HttpStatus.CREATED); // Returns the created comment with an HTTP 201 Created status.
    }

    @DeleteMapping("/{commentId}") // Maps HTTP DELETE requests to the following method.
    public ResponseEntity<Void> deleteComment(@PathVariable String postId, @PathVariable String commentId) { // Defines a method to delete a comment by ID
        commentService.deleteComment(postId, commentId); // Deletes a specific comment by ID for a given post.
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); // Returns an HTTP 204 No Content status to indicate success.
    }

    @PutMapping("/{commentId}") // Maps HTTP PUT requests to the following method.
    public ResponseEntity<Comment> editComment(@PathVariable String commentId, @RequestBody CommentDTO request) { // Defines a method to edit a comment
        Comment editedComment = commentService.editComment(commentId, request.getContent()); // Edits a comment's content by ID.
        if (editedComment != null) { // Checks if the comment was successfully edited.
            return new ResponseEntity<>(editedComment, HttpStatus.OK); // Returns the edited comment with an HTTP 200 OK status.
        } else { // If the comment was not found or could not be edited.
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Returns an HTTP 404 Not Found status.
        }
    }
}

