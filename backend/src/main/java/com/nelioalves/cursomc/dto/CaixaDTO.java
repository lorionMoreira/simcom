package com.nelioalves.cursomc.dto;

public class CaixaDTO {


    private Integer cpId; // Componente ID
    private Integer cpQuantidade; // Componente Quantity
    private Integer tpId; // TipoComponente ID
    private String nome; // Nome
    private String especificacao; // Especificação
    private String valor; // Valor
    private Integer tpQuantidade; // TipoComponente Quantity

    public CaixaDTO(Integer cpId, Integer cpQuantidade, Integer tpId, String nome, String especificacao, String valor, Integer tpQuantidade) {
        this.cpId = cpId;
        this.cpQuantidade = cpQuantidade;
        this.tpId = tpId;
        this.nome = nome;
        this.especificacao = especificacao;
        this.valor = valor;
        this.tpQuantidade = tpQuantidade;
    }

    // Getters
    public Integer getCpId() {
        return cpId;
    }

    public Integer getCpQuantidade() {
        return cpQuantidade;
    }

    public Integer getTpId() {
        return tpId;
    }

    public String getNome() {
        return nome;
    }

    public String getEspecificacao() {
        return especificacao;
    }

    public String getValor() {
        return valor;
    }

    public Integer getTpQuantidade() {
        return tpQuantidade;
    }

    // Setters
    public void setCpId(Integer cpId) {
        this.cpId = cpId;
    }

    public void setCpQuantidade(Integer cpQuantidade) {
        this.cpQuantidade = cpQuantidade;
    }

    public void setTpId(Integer tpId) {
        this.tpId = tpId;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setEspecificacao(String especificacao) {
        this.especificacao = especificacao;
    }

    public void setValor(String valor) {
        this.valor = valor;
    }

    public void setTpQuantidade(Integer tpQuantidade) {
        this.tpQuantidade = tpQuantidade;
    }
}
