package com.petpassport.backend.repository;

import com.petpassport.backend.entity.Vaccine;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VaccineRepository extends JpaRepository<Vaccine, Long> {
    List<Vaccine> findByPetId(Long petId);
    void deleteByPetId(Long petId);
}
