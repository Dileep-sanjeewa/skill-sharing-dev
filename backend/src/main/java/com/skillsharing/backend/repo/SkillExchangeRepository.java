package com.skillsharing.backend.repo;

import com.skillsharing.backend.model.SkillExchange;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SkillExchangeRepository extends MongoRepository<SkillExchange, String> {
}