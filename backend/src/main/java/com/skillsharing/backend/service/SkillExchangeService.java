package com.skillsharing.backend.service;

import com.skillsharing.backend.model.SkillExchange;

import java.util.List;

public interface SkillExchangeService {
    SkillExchange createSkillExchange(SkillExchange skillExchange);
    List<SkillExchange> getAllSkillExchanges();
    SkillExchange getSkillExchangeById(String id);
    SkillExchange updateSkillExchange(String id, SkillExchange skillExchange);
    void deleteSkillExchange(String id);
}

