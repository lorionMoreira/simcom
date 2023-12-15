package com.nelioalves.cursomvc;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.ComponentScan;

import com.nelioalves.cursomc.CursomcApplication;
import com.nelioalves.cursomc.domain.Disciplina;
import com.nelioalves.cursomc.domain.Unidade;
import com.nelioalves.cursomc.services.UnidadeService;

@SpringBootTest(classes= CursomcApplication.class)
public class CursomcApplicationTest {


    @Autowired
    private UnidadeService unidadeservice;
	
	
	@BeforeEach
	public void beforeEach() {
		
		
	}
	
	@Test
	void basicTest() {
		Unidade unidade = unidadeservice.find(1);
		
		System.out.println(unidade.toString());
	}
}
