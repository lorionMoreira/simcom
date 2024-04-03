package com.nelioalves.cursomc.services;


import com.nelioalves.cursomc.domain.Componente;
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

	public List<Componente> computeInsert(List<ComponenteDTO2> objDtoList) {
		// Generate a UUID
		List<Componente> objSavedList = new ArrayList<>();

		for (ComponenteDTO2 objDto : objDtoList) {

			Componente obj = find(objDto.getId());

			if(obj.getTipoComponente().getTipo() == 1 ) {
				if(obj.getQuantidade() >= objDto.getQuantidade()) {

					Integer qtdPedida = objDto.getQuantidade();
					Integer qtdDisponivel = obj.getQuantidade();

					Integer existente = qtdDisponivel - qtdPedida;
					obj.setQuantidade(existente);

					objSavedList.add(update(obj));

					if(existente == 0) {
						repo.deleteById(obj.getId());
					}
				}else{
					throw new DataIntegrityException("Insufficient quantity available.");

				}
			}else if(obj.getTipoComponente().getTipo() == 2 ) {
				if(obj.getQuantidade() > objDto.getQuantidade()) {

					Integer qtdPedida = objDto.getQuantidade();
					Integer qtdDisponivel = obj.getQuantidade();

					Integer existente = qtdDisponivel - qtdPedida;
					obj.setQuantidade(existente);

					objSavedList.add(update(obj));

					Componente componente2 = new Componente();

					componente2.setFornecedor(obj.getFornecedor());
					componente2.setFornecedorData(obj.getFornecedorData());
					componente2.setObs(obj.getObs());
					componente2.setQuantidade(qtdPedida);
					componente2.setTipoComponente(obj.getTipoComponente());
					componente2.setUser(clienteservice.find(objDto.getUserId()));
					componente2.setUuid(obj.getUuid());
					componente2.setValidade(obj.getValidade());

					objSavedList.add(repo.save(componente2));

					if(existente == 0) {
						repo.deleteById(obj.getId());
					}

				}else {
					throw new AuthorizationException("Insufficient quantity available.");
				}
			}else {
				throw new AuthorizationException("Insufficient quantity available.");
			}
		}

		return objSavedList;
	}
}
