package com.nelioalves.cursomc.repositories;


import com.nelioalves.cursomc.domain.Emprestimo;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EmprestimoRepository extends JpaRepository<Emprestimo, Integer> {

}
