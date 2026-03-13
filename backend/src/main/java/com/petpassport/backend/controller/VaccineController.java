package com.petpassport.backend.controller;

import com.petpassport.backend.entity.Vaccine;
import com.petpassport.backend.repository.VaccineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/vaccines")
@RequiredArgsConstructor
public class VaccineController {

    private final VaccineRepository vaccineRepository;

    @GetMapping("/pet/{petId}")
    public List<Vaccine> getVaccinesByPet(@PathVariable Long petId) {
        return vaccineRepository.findByPetId(petId);
    }

    @PostMapping
    public Vaccine createVaccine(@RequestBody Vaccine vaccine) {
        return vaccineRepository.save(vaccine);
    }

    @DeleteMapping("/{id}")
    public void deleteVaccine(@PathVariable Long id) {
        vaccineRepository.deleteById(id);
    }
}