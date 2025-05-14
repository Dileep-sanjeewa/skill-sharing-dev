package com.skillsharing.backend.service.impl;

import com.skillsharing.backend.model.SkillExchange;
import com.skillsharing.backend.repo.SkillExchangeRepository;
import com.skillsharing.backend.service.SkillExchangeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SkillExchangeServiceImpl implements SkillExchangeService {

    @Autowired
    private SkillExchangeRepository skillExchangeRepository;

    @Override
    public SkillExchange createSkillExchange(SkillExchange skillExchange) {
        return skillExchangeRepository.save(skillExchange);
    }

    @Override
    public List<SkillExchange> getAllSkillExchanges() {
        return skillExchangeRepository.findAll();
    }

    @Override
    public SkillExchange getSkillExchangeById(String id) {
        Optional<SkillExchange> skillExchange = skillExchangeRepository.findById(id);
        return skillExchange.orElse(null);
    }

    @Override
    public SkillExchange updateSkillExchange(String id, SkillExchange updatedExchange) {
        Optional<SkillExchange> existingExchangeOpt = skillExchangeRepository.findById(id);
        if (existingExchangeOpt.isPresent()) {
            SkillExchange existing = existingExchangeOpt.get();
            existing.setSkillOffered(updatedExchange.getSkillOffered());
            existing.setSkillRequested(updatedExchange.getSkillRequested());
            existing.setDescription(updatedExchange.getDescription());
            existing.setExchangeDate(updatedExchange.getExchangeDate());
            return skillExchangeRepository.save(existing);
        }
        return null;
    }

    @Override
    public void deleteSkillExchange(String id) {
        skillExchangeRepository.deleteById(id);
    }
}
