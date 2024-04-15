package com.nelioalves.cursomc.services;

import com.nelioalves.cursomc.domain.Componente;
import com.nelioalves.cursomc.domain.ComprasLog;
import com.nelioalves.cursomc.domain.Emprestimo;
import com.nelioalves.cursomc.repositories.ComponenteRepository;
import com.nelioalves.cursomc.repositories.ComprasLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;

@Service
public class ComprasLogService {

    @Autowired
    private ComprasLogRepository repo;


    public ComprasLog componentToComprasLog(Componente obj) {

        //Timestamp timestamp = Timestamp.from(Instant.now());

        ComprasLog comprasLog = new ComprasLog();

        comprasLog.setFornecedor(obj.getFornecedor());
        comprasLog.setFornecedorData(obj.getFornecedorData());
        comprasLog.setLocalizacao(obj.getLocalizacao());
        comprasLog.setObs(obj.getObs());
        comprasLog.setQuantidade(obj.getQuantidade());
        comprasLog.setTipoComponente(obj.getTipoComponente());
        comprasLog.setUser(obj.getUser());
        comprasLog.setUuid(obj.getUuid());
        comprasLog.setValidade(obj.getValidade());

        return comprasLog;

    }

    public ComprasLog insert(ComprasLog obj) {
        return repo.save(obj);
    }
}
