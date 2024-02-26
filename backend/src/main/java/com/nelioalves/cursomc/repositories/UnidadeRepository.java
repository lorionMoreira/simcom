package com.nelioalves.cursomc.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.nelioalves.cursomc.domain.Unidade;

import java.util.List;

public interface UnidadeRepository extends JpaRepository<Unidade, Integer> {
    List<Unidade> findAllByOrderByNomeAsc();
}
