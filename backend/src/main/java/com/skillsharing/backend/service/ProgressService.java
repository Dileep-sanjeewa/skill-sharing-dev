package com.skillsharing.backend.service;


import java.util.List;
import java.util.Optional;

import com.skillsharing.backend.model.Progress;

public interface ProgressService {

    List<Progress> getAllProgress();

    Optional<Progress> getProgressById(String id);

    Progress createProgress(Progress progress);

    Progress updateProgress(String progressId, Progress progress);

    void deleteProgress(String progressId);
}

