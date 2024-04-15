package com.nelioalves.cursomc.services;


import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.nelioalves.cursomc.domain.TipoComponente;
import com.nelioalves.cursomc.services.exceptions.DataIntegrityException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.nelioalves.cursomc.domain.Componente;
import com.nelioalves.cursomc.domain.Emprestimo;
import com.nelioalves.cursomc.dto.ComponenteDTO;
import com.nelioalves.cursomc.dto.ComponenteDTO2;

import com.nelioalves.cursomc.repositories.ComponenteRepository;
import com.nelioalves.cursomc.resources.utils.HandleInputs;
import com.nelioalves.cursomc.resources.utils.UUIDUtils;
import com.nelioalves.cursomc.services.exceptions.AuthorizationException;
import com.nelioalves.cursomc.services.exceptions.ObjectNotFoundException;


@Service
public class ComponenteService {

    @Autowired
    private ComponenteRepository repo;

    @Autowired
    private TipoComponenteService tipoComponenteService;
    
    @Autowired
    private ClienteService clienteservice;

    @Autowired
    private EmprestimoService emprestimoService;

    public List<Componente> findAll() {
        return repo.findAll();
    }
    
    public Componente find(Integer id) {

        Optional<Componente> obj = repo.findById(id);
        return obj.orElseThrow(() -> new ObjectNotFoundException(
                "Objeto não encontrado! Id: " + id + ", Tipo: " + Componente.class.getName()));
    }

    // criação de dto para insert
    public Componente fromDTO(ComponenteDTO objDto) {
        return new Componente(null,
                objDto.getQuantidade(),
                objDto.getUuid(),
                objDto.getObs(),
                objDto.getFornecedor(),
                objDto.getFornecedorData(),
                objDto.getValidade(),
                tipoComponenteService.find(objDto.getTipoComponenteId()),
                null,objDto.getLocalizacao());
    }
    
	public Componente update(ComponenteDTO objDto,Integer id) {
		Componente obj = find(id);
		updateData(objDto, obj);
		return repo.save(obj);
	}
	
	private void updateData(ComponenteDTO objDto, Componente obj) {
	    if (objDto.getQuantidade() != null) {
	        obj.setQuantidade(objDto.getQuantidade());
	    }
	    
	    if (objDto.getObs() != null) {
	        obj.setObs(objDto.getObs());
	    }
	    
	    if (objDto.getFornecedor() != null) {
	        obj.setFornecedor(objDto.getFornecedor());
	    }
	    
	    if (objDto.getFornecedorData() != null) {
	        obj.setFornecedorData(objDto.getFornecedorData());
	    }
	    
	    if (objDto.getValidade() != null) {
	        obj.setValidade(objDto.getValidade());
	    }
	    	    
	    if (objDto.getTipoComponenteId() != null) {
	        obj.setTipoComponente(tipoComponenteService.find(objDto.getTipoComponenteId()));
	    }
	    
		
	}
	
    /*
    public Page<Componente> findWithConditionsAndPagination(int pageNumber, int pageSize) {
        // Create a PageRequest object with pagination parameters
        PageRequest pageRequest = PageRequest.of(pageNumber, pageSize);

        Page<Componente> result = repo.findWithNullLocal(pageRequest);

        return result;
    }
	*/
	public Page<Componente> findWithPaginationNull(int pageNumber, int pageSize) {
		// Create a PageRequest object with pagination parameters
		PageRequest pageRequest = PageRequest.of(pageNumber, pageSize);

		Page<Componente> result = repo.findWithNullLocal(pageRequest);

		return result;
	}
    public Page<Componente> findWithPagination(int pageNumber, int pageSize) {
        // Create a PageRequest object with pagination parameters
        PageRequest pageRequest = PageRequest.of(pageNumber, pageSize);

        Page<Componente> result = repo.findAll(pageRequest);

        return result;
    }

	public Page<Componente> findWithConditionsAndPaginationPostNull(String conditionDirty, int pageNumber, int pageSize) {
		// Create a PageRequest object with pagination parameters
		PageRequest pageRequest = PageRequest.of(pageNumber, pageSize);

		String searchTerm = HandleInputs.getInputParam(conditionDirty);

		Page<Componente> result = repo.findWithConditionsAndPaginationPostNull(searchTerm, pageRequest);

		return result;

	}
    
    public Page<Componente> findWithConditionsAndPaginationPost(String conditionDirty, int pageNumber, int pageSize) {
        // Create a PageRequest object with pagination parameters
        PageRequest pageRequest = PageRequest.of(pageNumber, pageSize);

        String searchTerm = HandleInputs.getInputParam(conditionDirty);

        Page<Componente> result = repo.findWithConditionsAndPaginationPost(searchTerm, pageRequest);

        return result;

    }




    /*
    public Page<Componente> findWithConditionsAndPaginationEmprestado(int pageNumber, int pageSize) {
        // Create a PageRequest object with pagination parameters
        PageRequest pageRequest = PageRequest.of(pageNumber, pageSize);

        Page<Componente> result = repo.findWithNullLocal(pageRequest);

        return result;
    }
	*/
    public Page<Componente> findWithConditionsAndPaginationPostEmprestado(String conditionDirty, int pageNumber,
            int pageSize) {
        // Create a PageRequest object with pagination parameters
        PageRequest pageRequest = PageRequest.of(pageNumber, pageSize);

        String searchTerm = HandleInputs.getInputParam(conditionDirty);

        Page<Componente> result = repo.findWithConditionsAndPaginationEmprestado(searchTerm, pageRequest);

        return result;
    }

    public Componente insert(Componente obj) {
        obj.setId(null);
        obj.setQuantidade(obj.getQuantidade());
        obj.setUuid(obj.getUuid());
        obj.setObs(obj.getObs());
        obj.setFornecedor(obj.getFornecedor());
        obj.setFornecedorData(obj.getFornecedorData());
        obj.setValidade(obj.getValidade());
        obj.setTipoComponente(obj.getTipoComponente());
        obj.setUser(null);


        return repo.save(obj);
    }
    
    public Componente update(Componente obj) {

        return repo.save(obj);
    }
    
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

                    Emprestimo objEmprestimo = emprestimoService.componentToEmprestimo(obj,objDto);
    				emprestimoService.insert(objEmprestimo);

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

                    Emprestimo objEmprestimo = emprestimoService.componentToEmprestimo(obj,objDto);
                    emprestimoService.insert(objEmprestimo);
    				    				    				
    				objSavedList.add(repo.save(componente2));
    				
    				if(existente == 0) {
    					repo.deleteById(obj.getId()); 
    				}
    				
    			}else {
    				throw new AuthorizationException("Erro ao salvar componente");
    			}
    		}else {
    			throw new AuthorizationException("Erro ao salvar componente");
    		}
    	}
    	
    	return objSavedList;
    }

    public ComponenteDTO insertUuid(ComponenteDTO objDto) {
        // Generate a UUID
        UUID uuid = UUID.randomUUID();

        int hashCode = UUIDUtils.hashUUID(uuid);
        objDto.setUuid(hashCode);
        return objDto;
    }

    public Componente getselectedComp(Integer tipoComponenteId, Integer quantidade) {
		List<Componente> components  = repo.findGetselectedComp(tipoComponenteId,quantidade);
		return components.isEmpty() ? null : components.get(0);
    }
}
