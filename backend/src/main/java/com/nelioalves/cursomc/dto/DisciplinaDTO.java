package com.nelioalves.cursomc.dto;

import java.io.Serializable;

import javax.validation.constraints.NotEmpty;


public class DisciplinaDTO implements Serializable {

    private static final long serialVersionUID = 1L;
    
    private Integer id;
    
    @NotEmpty(message = "O nome deve ser preenchido")
    private String nome;

	@NotEmpty(message = "O nome deve ser preenchido")
	private String orderid;


	public DisciplinaDTO() {
		super();
		// TODO Auto-generated constructor stub
	}



	public DisciplinaDTO(Integer id, String nome, String orderid) {
		this.id = id;
		this.nome = nome;
		this.orderid = orderid;
	}

	public String getOrderid() {
		return orderid;
	}

	public void setOrderid(String orderid) {
		this.orderid = orderid;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}
    
    
}
