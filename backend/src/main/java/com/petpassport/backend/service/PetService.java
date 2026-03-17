package com.petpassport.backend.service;

import com.petpassport.backend.entity.Pet;
import com.petpassport.backend.repository.MedicalRecordRepository;
import com.petpassport.backend.repository.PetRepository;
import com.petpassport.backend.repository.VaccineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PetService {

    private final PetRepository petRepository;
    private final VaccineRepository vaccineRepository;
    private final MedicalRecordRepository medicalRecordRepository;

    public List<Pet> getPetsByOwner(Long ownerId) {
        return petRepository.findByOwner_Id(ownerId);
    }

    public Pet getPetById(Long id) {
        return petRepository.findById(id).orElseThrow();
    }

    public Pet createPet(Pet pet) {
        pet.setQrCode(UUID.randomUUID().toString());
        return petRepository.save(pet);
    }

    public Pet getPetByQrCode(String qrCode) {
        return petRepository.findByQrCode(qrCode);
    }

    @Transactional
    public void deletePet(Long id) {
        vaccineRepository.deleteByPetId(id);
        medicalRecordRepository.deleteByPetId(id);
        petRepository.deleteById(id);
    }

    public Pet updatePet(Long id, Pet updated) {
        updated.setId(id);
        updated.setQrCode(petRepository.findById(id).orElseThrow().getQrCode());
        return petRepository.save(updated);
    }
}
