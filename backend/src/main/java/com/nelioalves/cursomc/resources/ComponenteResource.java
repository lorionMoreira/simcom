package com.nelioalves.cursomc.resources;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.stream.Collectors;

import javax.validation.Valid;

import com.nelioalves.cursomc.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import com.nelioalves.cursomc.domain.Componente;
import com.nelioalves.cursomc.domain.ComprasLog;
import com.nelioalves.cursomc.domain.DisciplinaComponente;
import com.nelioalves.cursomc.domain.Emprestimo;
import com.nelioalves.cursomc.domain.Reserva;
import com.nelioalves.cursomc.domain.TipoComponente;
import com.nelioalves.cursomc.domain.User;
import com.nelioalves.cursomc.dto.ComponenteDTO;
import com.nelioalves.cursomc.dto.ComponenteDTO2;
import com.nelioalves.cursomc.dto.ReservaDTO;
import com.nelioalves.cursomc.dto.TipoComponenteDTO;
import com.nelioalves.cursomc.dto.CaixaDTO;
import com.nelioalves.cursomc.resources.utils.ListComponenteDTOconverter;
import com.nelioalves.cursomc.resources.utils.ReservaDTOconverter;
import com.nelioalves.cursomc.services.exceptions.AuthorizationException;

@RestController
@RequestMapping(value = "/api/componentes")
public class ComponenteResource {

    @Autowired
    private ComponenteService service;



    @Autowired
    private ComprasLogService comprasLogService;

    @Autowired
    private ReservaService reservaService;

    @Autowired
    private TipoComponenteService tpService;
    /*
    @GetMapping("/buscar")
    public ResponseEntity<Page<Componente>> getEntitiesWithPagination(
            @RequestParam(value = "page", defaultValue = "0") int pageNumber,
            @RequestParam(value = "size", defaultValue = "2") int pageSize) {
        Page<Componente> entities = service.findWithConditionsAndPagination(pageNumber, pageSize);
        return ResponseEntity.ok().body(entities);
    }
	*/
    @GetMapping("/buscar/index")
    public ResponseEntity<Page<Componente>> getEntitiesWithPaginationIndex(
            @RequestParam(value = "page", defaultValue = "0") int pageNumber,
            @RequestParam(value = "size", defaultValue = "2") int pageSize) {
        Page<Componente> entities = service.findWithPaginationNull(pageNumber, pageSize);
        return ResponseEntity.ok().body(entities);
    }

    @GetMapping("/buscar/solicitado")
    public ResponseEntity<Page<Componente>> getEntitiesWithPaginationSolicitado(
            @RequestParam(value = "page", defaultValue = "0") int pageNumber,
            @RequestParam(value = "size", defaultValue = "2") int pageSize) {
        Page<Componente> entities = service.findWithPagination(pageNumber, pageSize);
        return ResponseEntity.ok().body(entities);
    }

    @PostMapping("/buscar/index")
    public ResponseEntity<Page<Componente>> getEntitiesWithConditionsNull(
            @RequestParam(value = "page", defaultValue = "0") int pageNumber,
            @RequestParam(value = "size", defaultValue = "10") int pageSize,
            @RequestBody String searchRequest) {

        Page<Componente> entities = service.findWithConditionsAndPaginationPostNull(searchRequest, pageNumber, pageSize);
        return ResponseEntity.ok().body(entities);
    }

    @PostMapping("/buscar/solicitado")
    public ResponseEntity<Page<Componente>> getEntitiesWithConditions(
            @RequestParam(value = "page", defaultValue = "0") int pageNumber,
            @RequestParam(value = "size", defaultValue = "10") int pageSize,
            @RequestBody String searchRequest) {

        Page<Componente> entities = service.findWithConditionsAndPaginationPost(searchRequest, pageNumber, pageSize);
        return ResponseEntity.ok().body(entities);
    }
    
	@RequestMapping(value = "/findbyid/{id}", method = RequestMethod.GET)
	public ResponseEntity<Componente> find(@PathVariable Integer id) {
		Componente obj = service.find(id);
		return ResponseEntity.ok().body(obj);
	}
	
    /*
    @GetMapping("/emprestado")
    public ResponseEntity<Page<Componente>> getEntitiesWithPagination2(
            @RequestParam(value = "page", defaultValue = "0") int pageNumber,
            @RequestParam(value = "size", defaultValue = "10") int pageSize) {
        Page<Componente> entities = service.findWithConditionsAndPaginationEmprestado(pageNumber, pageSize);
        return ResponseEntity.ok().body(entities);
    }
    */

    @PostMapping("/emprestado")
    public ResponseEntity<Page<Componente>> getEntitiesWithConditions2(
            @RequestParam(value = "page", defaultValue = "0") int pageNumber,
            @RequestParam(value = "size", defaultValue = "10") int pageSize,
            @RequestBody String searchRequest) throws IOException {

        Page<Componente> entities = service.findWithConditionsAndPaginationPostEmprestado(searchRequest, pageNumber,
                pageSize);
        return ResponseEntity.ok().body(entities);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Componente>> findAll() {
        List<Componente> componentes = service.findAll();
        return ResponseEntity.ok().body(componentes);
    }

    @PostMapping("/getlistaexperimento")
    public ResponseEntity<?> getListaExperimento(@RequestBody Map<String, Object> requestBody) {

        List<CaixaDTO> caixas = new ArrayList<>();

        String experimentoIdStr = (String) requestBody.get("experimentoid");
        Integer experimentoid = Integer.parseInt(experimentoIdStr);

        //List<Componente> componentes = service.findAll();

        List<Reserva> reservas = reservaService.findByExperimentoId(experimentoid);

        for (Reserva reserva : reservas) {

            TipoComponente tp = tpService.find(reserva.getTipoComponenteId().getId());

            Componente componente = service.getselectedComp(reserva.getTipoComponenteId().getId(),reserva.getQuantidade());

            CaixaDTO caixa;
            if(componente != null){
                caixa = new CaixaDTO(componente.getId(),componente.getQuantidade(),
                        tp.getId(),tp.getNome(),tp.getEspecificacao(),tp.getValor(),reserva.getQuantidade());
            }else{
                caixa = new CaixaDTO(null,null,
                        tp.getId(),tp.getNome(),tp.getEspecificacao(),tp.getValor(),reserva.getQuantidade());
            }
            caixas.add(caixa);
        }


        return new ResponseEntity<>(caixas, HttpStatus.OK);

    }



    @PostMapping("/salvar")
    public ResponseEntity<Componente> insert(@Valid @RequestBody ComponenteDTO objDto) {

        ComponenteDTO objDtoComplete = service.insertUuid(objDto);
        Componente obj = service.fromDTO(objDtoComplete);
        service.insert(obj);

        ComprasLog objComprasLog = comprasLogService.componentToComprasLog(obj);
        comprasLogService.insert(objComprasLog);

        return ResponseEntity.ok().body(obj);
    }
    
	@RequestMapping(value = "update/{id}", method = RequestMethod.PUT)
	public ResponseEntity<Void> update(@Valid @RequestBody ComponenteDTO objDto, @PathVariable Integer id) {
		

		Componente	obj = service.update(objDto,id);
		
		return ResponseEntity.noContent().build();
	}
	
    @PostMapping("/salvartodos")
    public ResponseEntity<List<Componente>> insertAll(
    		@RequestBody Map<String, Map<String, Object>> productMap) {
    	
    	List<ComponenteDTO2> objDtoList = ListComponenteDTOconverter.convertToObj(productMap);
    	    	
    	List<Componente> objSavedList = service.computeInsert(objDtoList);
    	
    	return ResponseEntity.ok(objSavedList);
    	
    }

}
