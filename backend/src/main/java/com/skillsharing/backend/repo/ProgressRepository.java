package com.skillsharing.backend.repo;


import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.skillsharing.backend.model.Progress;

@Repository
public interface ProgressRepository extends MongoRepository<Progress, String> {

}

