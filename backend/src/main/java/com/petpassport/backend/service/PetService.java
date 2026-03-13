package com.petpassport.backend.service;

import com.petpassport.backend.entity.Pet;
import com.petpassport.backend.repository.PetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PetService {

    private final PetRepository petRepository;

    public List<Pet> getPetsByOwner(Long ownerId) {
        return petRepository.findByOwnerId(ownerId);
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

    public void deletePet(Long id) {
        petRepository.deleteById(id);
    }
}
