package com.petpassport.backend.controller;

import com.petpassport.backend.entity.MedicalRecord;
import com.petpassport.backend.repository.MedicalRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
@RequiredArgsConstructor
public class MedicalRecordController {

    private final MedicalRecordRepository medicalRecordRepository;

    @GetMapping("/pet/{petId}")
    public List<MedicalRecord> getRecordsByPet(@PathVariable Long petId) {
        return medicalRecordRepository.findByPetId(petId);
    }

    @PostMapping
    public MedicalRecord createRecord(@RequestBody MedicalRecord record) {
        return medicalRecordRepository.save(record);
    }

    @DeleteMapping("/{id}")
    public void deleteRecord(@PathVariable Long id) {
        medicalRecordRepository.deleteById(id);
    }


    @PutMapping("/{id}")
    public MedicalRecord updateRecord(@PathVariable Long id, @RequestBody MedicalRecord updated) {
        updated.setId(id);
        return medicalRecordRepository.save(updated);
    }
}