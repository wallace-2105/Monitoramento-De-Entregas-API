package com.alexsander.monitoramento_entregas_api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "entregadores")
public class Entregador {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    private String nome;

    @Column(unique = true)
    private String telefone;

    @Enumerated(EnumType.STRING)
    private StatusEntregador status;

    //Construtor padrao da Jpa
    public Entregador(){}

    public Long getId() {
        return Id;
    }

    public void setId(Long id) {
        Id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public StatusEntregador getStatus() {
        return status;
    }

    public void setStatus(StatusEntregador status) {
        this.status = status;
    }

    public static Entregador criar(String nome, String telefone){
        Entregador entregador = new Entregador();
        entregador.nome = nome;
        entregador.telefone = telefone;
        entregador.status = StatusEntregador.DISPONIVEL;
        return entregador;
    }
}
