package com.nelioalves.cursomc.domain;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "disciplinas")
public class Disciplina implements Serializable{

	 	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

		@Id
	 	@GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Integer id;

		@NotEmpty(message="Preenchimento obrigatório")
	    private String nome;

		@NotEmpty(message="Preenchimento obrigatório")
		private String orderid;
	    
	    @JsonIgnore
	    @OneToMany(mappedBy = "disciplinaId")
	    private List<DisciplinaComponente> dc = new ArrayList<>();

	    // Constructors, getters, and setters

	    public Disciplina() {
	    	super();
	    }

	    public Disciplina(Integer id, String nome, String orderid) {
			super();
			this.id = id;
			this.nome = nome;
			this.orderid = orderid;
		}

		// Getters and Setters

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

	    public List<DisciplinaComponente> getDc() {
	        return dc;
	    }

	    public void setDc(List<DisciplinaComponente> dc) {
	        this.dc = dc;
	    }

		@Override
		public String toString() {
			return "Disciplina [id=" + id + ", nome=" + nome + "]";
		}
	    
	
}
