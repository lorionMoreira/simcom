package com.nelioalves.cursomc.services;


import com.nelioalves.cursomc.domain.Componente;
import com.nelioalves.cursomc.domain.Emprestimo;
import com.nelioalves.cursomc.domain.User;
import com.nelioalves.cursomc.dto.ComponenteDTO;
import com.nelioalves.cursomc.dto.ComponenteDTO2;
import com.nelioalves.cursomc.repositories.ComponenteRepository;
import com.nelioalves.cursomc.resources.utils.HandleInputs;
import com.nelioalves.cursomc.resources.utils.UUIDUtils;
import com.nelioalves.cursomc.services.exceptions.AuthorizationException;
import com.nelioalves.cursomc.services.exceptions.DataIntegrityException;
import com.nelioalves.cursomc.services.exceptions.ObjectNotFoundException;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.nelioalves.cursomc.repositories.EmprestimoRepository;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


@Service
public class EmprestimoService {

    @Autowired
    private EmprestimoRepository repo;

    @Autowired
    private TipoComponenteService tipoComponenteService;

	@Autowired
    private ComponenteService componenteService;
	@Autowired
	private ClienteService clienteService;

	public Emprestimo componentToEmprestimo(Componente obj,ComponenteDTO2 objDto) {
		User user = clienteService.find(objDto.getUserId());
		Timestamp timestamp = Timestamp.from(Instant.now());

		Emprestimo emprestimo = new Emprestimo();

		emprestimo.setCodigo(obj.getUuid().toString());
		emprestimo.setDataEmprestado(timestamp);
		emprestimo.setQuantidade(objDto.getQuantidade());
		emprestimo.setTipoComponente(obj.getTipoComponente());

		emprestimo.setUser(user);

		return emprestimo;
		
	}

    public Emprestimo insert(Emprestimo obj) {
        return repo.save(obj);
    }
}
