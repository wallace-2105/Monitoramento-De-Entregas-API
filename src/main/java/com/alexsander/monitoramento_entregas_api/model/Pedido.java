package com.alexsander.monitoramento_entregas_api.model;

import com.alexsander.monitoramento_entregas_api.exception.EstadoInvalidoException;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "pedidos")
@Getter
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @Column(nullable = false)
    private String cliente;

    @Setter
    @Column(nullable = false)
    private String enderecoEntrega;

    @Setter
    @Column(nullable = false)
    private String cep;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusPedido status;

    @Column(nullable = false)
    private LocalDateTime dataCriacao;

    public static Pedido criar(String cliente, String enderecoEntrega, String cep) {
        Pedido pedido = new Pedido();
        pedido.cliente = cliente;
        pedido.enderecoEntrega = enderecoEntrega;
        pedido.cep = cep;
        pedido.status = StatusPedido.PENDENTE;
        pedido.dataCriacao = LocalDateTime.now();
        return pedido;
    }

    // Transições de status - sem setter público, só métodos de negócio

    public void iniciarRota() {
        if (this.status != StatusPedido.PENDENTE) {
            throw new EstadoInvalidoException("Pedido não pode iniciar rota. Status atual: " + this.status);
        }
        this.status = StatusPedido.EM_ROTA;
    }

    public void concluir() {
        if (this.status != StatusPedido.EM_ROTA) {
            throw new EstadoInvalidoException("Pedido só pode ser concluído se estiver EM_ROTA. Status atual: " + this.status);
        }
        this.status = StatusPedido.ENTREGUE;
    }

    public void registrarFalha() {
        if (this.status != StatusPedido.EM_ROTA) {
            throw new EstadoInvalidoException("Não é possível registrar falha. Pedido não está EM_ROTA. Status atual: " + this.status);
        }
        this.status = StatusPedido.FALHA;
    }

    public void voltarParaPendente() {
        this.status = StatusPedido.PENDENTE;
    }
}