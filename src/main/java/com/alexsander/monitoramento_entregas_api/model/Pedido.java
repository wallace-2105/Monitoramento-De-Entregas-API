package com.alexsander.monitoramento_entregas_api.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "pedidos")
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cliente;
    private String enderecoEntrega;
    private String cep;

    @Enumerated(EnumType.STRING)
    private StatusPedido status;
    private LocalDateTime dataCriacao;

    //Contrutor padrao para JPA
    public Pedido() {
    }

    public Long getId() {
        return id;
    }

    public void setCep(String cep) {
        this.cep = cep;
    }

    public String getCep() {
        return cep;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCliente() {
        return cliente;
    }

    public void setCliente(String cliente) {
        this.cliente = cliente;
    }

    public String getEnderecoEntrega() {
        return enderecoEntrega;
    }

    public void setEnderecoEntrega(String enderecoEntrega) {
        this.enderecoEntrega = enderecoEntrega;
    }

    public StatusPedido getStatus() {
        return status;
    }

    public void setStatus(StatusPedido status) {
        this.status = status;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    //metodo estatico criado para criar pedido no service
    public static Pedido criar(String cliente, String enderecoEntrega,String cep) {
        Pedido pedido = new Pedido();
        pedido.cliente = cliente;
        pedido.enderecoEntrega = enderecoEntrega;
        pedido.cep = cep;
        pedido.status = StatusPedido.PENDENTE;
        pedido.dataCriacao = LocalDateTime.now();
        return pedido;
    }
}