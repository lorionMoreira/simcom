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

    private String codigo;
    
    public Emprestimo() {
    }

    public Emprestimo(Integer id, User user, TipoComponente tipoComponente, Integer quantidade,
            Timestamp dataEmprestado, Timestamp dataDevolvido,  String codigo) {
        this.id = id;
        this.user = user;
        this.tipoComponente = tipoComponente;
        this.quantidade = quantidade;
        this.dataEmprestado = dataEmprestado;
        this.dataDevolvido = dataDevolvido;
        this.codigo = codigo;
    }

    public static long getSerialversionuid() {
        return serialVersionUID;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public TipoComponente getTipoComponente() {
        return tipoComponente;
    }

    public void setTipoComponente(TipoComponente tipoComponente) {
        this.tipoComponente = tipoComponente;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public Timestamp getDataEmprestado() {
        return dataEmprestado;
    }

    public void setDataEmprestado(Timestamp dataEmprestado) {
        this.dataEmprestado = dataEmprestado;
    }

    public Timestamp getDataDevolvido() {
        return dataDevolvido;
    }

    public void setDataDevolvido(Timestamp dataDevolvido) {
        this.dataDevolvido = dataDevolvido;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    
    
}
