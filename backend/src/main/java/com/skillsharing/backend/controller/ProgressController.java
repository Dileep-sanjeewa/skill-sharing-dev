package com.skillsharing.backend.controller;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.skillsharing.backend.model.Progress;
import com.skillsharing.backend.service.ProgressService;

@RestController
@RequestMapping("/progress")
public class ProgressController {

    @Autowired
    private ProgressService progressService;

    @GetMapping
    public List<Progress> getAllProgress() {
        return progressService.getAllProgress();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Progress> getProgressById(@PathVariable String id) {
        Optional<Progress> progress = progressService.getProgressById(id);
        return progress.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<Progress> createProgress(@RequestBody Progress progress) {
        Progress savedProgress = progressService.createProgress(progress);
        return new ResponseEntity<>(savedProgress, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Progress> updateProgress(@PathVariable String id, @RequestBody Progress progress) {
        Progress updatedProgress = progressService.updateProgress(id, progress);
        if (updatedProgress != null) {
            return new ResponseEntity<>(updatedProgress, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{progressId}")
    public ResponseEntity<Void> deleteProgress(@PathVariable String progressId) {
        progressService.deleteProgress(progressId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
