package com.nelioalves.cursomc.domain;

import javax.persistence.*;

import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "compras_logs")
public class ComprasLog  implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "uuid")
    private Integer uuid;

    @ManyToOne
    @JoinColumn(name = "tipo_componente_id")
    private TipoComponente tipoComponente;

    private Integer quantidade;
    private String obs;
    private String fornecedor;

    @Column(name = "fornecedor_data")
    private Date fornecedorData;

    private Date validade;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String localizacao;

    // Constructors
    public ComprasLog() {
    }

    public ComprasLog(Integer id, Integer quantidade, Integer uuid, String obs, String fornecedor, Date fornecedorData,
                      Date validade,
                      TipoComponente tipoComponente,
                      User user,
                      String localizacao) {
        this.id = id;
        this.uuid = uuid;
        this.tipoComponente = tipoComponente;
        this.quantidade = quantidade;
        this.obs = obs;
        this.fornecedor = fornecedor;
        this.fornecedorData = fornecedorData;
        this.validade = validade;
        this.user = user;
        this.localizacao = localizacao;
    }
    // Getters and Setters

    public Integer getId() {
        return id;
    }

    public String getLocalizacao() {
        return localizacao;
    }

    public void setLocalizacao(String localizacao) {
        this.localizacao = localizacao;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUuid() {
        return uuid;
    }

    public void setUuid(Integer uuid) {
        this.uuid = uuid;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public String getObs() {
        return obs;
    }

    public void setObs(String obs) {
        this.obs = obs;
    }

    public String getFornecedor() {
        return fornecedor;
    }

    public void setFornecedor(String fornecedor) {
        this.fornecedor = fornecedor;
    }

    public Date getFornecedorData() {
        return fornecedorData;
    }

    public void setFornecedorData(Date fornecedorData) {
        this.fornecedorData = fornecedorData;
    }

    public Date getValidade() {
        return validade;
    }

    public void setValidade(Date validade) {
        this.validade = validade;
    }

    public User getUser() {
        return user;
    }

    // Setter
    public void setUser(User user) {
        this.user = user;
    }

    public TipoComponente getTipoComponente() {
        return tipoComponente;
    }

    // Setter
    public void setTipoComponente(TipoComponente tipoComponente) {
        this.tipoComponente = tipoComponente;
    }

}
