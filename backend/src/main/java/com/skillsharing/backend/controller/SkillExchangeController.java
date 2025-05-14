package com.skillsharing.backend.controller;

import com.skillsharing.backend.model.SkillExchange;
import com.skillsharing.backend.service.SkillExchangeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/skillExchange")
@CrossOrigin(origins = "*")
public class SkillExchangeController {

    @Autowired
    private SkillExchangeService skillExchangeService;

    @PostMapping
    public ResponseEntity<SkillExchange> createSkillExchange(@RequestBody SkillExchange skillExchange) {
        SkillExchange created = skillExchangeService.createSkillExchange(skillExchange);
        return ResponseEntity.status(201).body(created);
    }

    @GetMapping
    public ResponseEntity<List<SkillExchange>> getAllSkillExchanges() {
        return ResponseEntity.ok(skillExchangeService.getAllSkillExchanges());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SkillExchange> getSkillExchangeById(@PathVariable String id) {
        SkillExchange found = skillExchangeService.getSkillExchangeById(id);
        return found != null ? ResponseEntity.ok(found) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<SkillExchange> updateSkillExchange(@PathVariable String id, @RequestBody SkillExchange skillExchange) {
        SkillExchange updated = skillExchangeService.updateSkillExchange(id, skillExchange);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSkillExchange(@PathVariable String id) {
        skillExchangeService.deleteSkillExchange(id);
        return ResponseEntity.noContent().build();
    }

}

