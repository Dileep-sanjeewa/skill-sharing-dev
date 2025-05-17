package com.skillsharing.backend.service;

import org.springframework.stereotype.Service;

import com.skillsharing.backend.DTO.ShareDTO;
import com.skillsharing.backend.model.SharePostModel;

import java.util.List;

@Service
public interface SharePostService {
    List<SharePostModel> getSharePosts();


    SharePostModel createSharePost(ShareDTO shareDTO);
    void deleteSharedPost(String id);

    List<SharePostModel> getSharePostsByuser(String id);
}

