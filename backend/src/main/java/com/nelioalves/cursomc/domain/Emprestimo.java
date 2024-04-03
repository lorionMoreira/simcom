package com.nelioalves.cursomc.domain;


import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;

@Entity
@Table(name = "emprestimos")
public class Emprestimo implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "tipo_componente_id")
    private TipoComponente tipoComponente;

    private Integer quantidade;

    @Column(name = "data_emprestado", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Timestamp dataEmprestado;

    @Column(name = "data_devolvido")
    private Timestamp dataDevolvido;

    private String observacoes;
    private String codigo;
}
