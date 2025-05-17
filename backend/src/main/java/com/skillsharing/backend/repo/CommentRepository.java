package com.skillsharing.backend.repo;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.skillsharing.backend.model.Comment;

import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByPostId(String postId);
}
