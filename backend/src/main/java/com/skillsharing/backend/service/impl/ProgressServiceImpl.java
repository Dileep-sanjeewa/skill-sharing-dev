package com.skillsharing.backend.service.impl;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skillsharing.backend.model.User;
import com.skillsharing.backend.model.Progress;
import com.skillsharing.backend.repo.UserRepository;
import com.skillsharing.backend.repo.ProgressRepository;
import com.skillsharing.backend.service.ProgressService;

@Service
public class ProgressServiceImpl implements ProgressService {

    @Autowired
    private ProgressRepository progressRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<Progress> getAllProgress() {
        return progressRepository.findAll();
    }

    @Override
    public Optional<Progress> getProgressById(String id) {
        return progressRepository.findById(id);
    }

    @Override
    public Progress createProgress(Progress progress) {
        Optional<User> userOptional = userRepository.findById(progress.getUserId());
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            progress.setUserId(user.getId());
            progress.setUsername(user.getName());
            progress.setUserProfile(user.getProfileImage());
            return progressRepository.save(progress);
        } else {
            return null;
        }
    }

    @Override
    public Progress updateProgress(String progressId, Progress progress) {
        if (progressRepository.existsById(progressId)) {
            Optional<User> userOptional = userRepository.findById(progress.getUserId());
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                progress.setProgressId(progressId);
                progress.setUserId(user.getId());
                progress.setUsername(user.getName());
                progress.setUserProfile(user.getProfileImage());
                progress.setMilestone(progress.getMilestone());
                progress.setDescription(progress.getDescription());
                progress.setProgressDate(progress.getProgressDate());
                return progressRepository.save(progress);
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    @Override
    public void deleteProgress(String progressId) {
        progressRepository.deleteById(progressId);
    }
}

