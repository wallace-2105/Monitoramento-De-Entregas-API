package com.alexsander.monitoramento_entregas_api.model;

import com.alexsander.monitoramento_entregas_api.exception.EstadoInvalidoException;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Table(name = "entregas")
@Entity
@Getter
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Entrega {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "pedido_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_entrega_pedido"))
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "entregador_id", nullable = false, foreignKey = @ForeignKey(name = "fk_entrega_entregador"))
    private Entregador entregador;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusEntrega status;

    private LocalDateTime dataInicio;
    private LocalDateTime dataConclusao;

    public static Entrega criar(Pedido pedido, Entregador entregador) {
        Entrega entrega = new Entrega();
        entrega.pedido = pedido;
        entrega.entregador = entregador;
        entrega.status = StatusEntrega.CRIADO;
        return entrega;
    }

    public void iniciar() {
        if (this.status != StatusEntrega.CRIADO) {
            throw new EstadoInvalidoException("Entrega não pode ser iniciada. Status atual da entrega: " + this.status);
        }
        this.status = StatusEntrega.EM_ROTA;
        this.dataInicio = LocalDateTime.now();
    }

    public void concluir() {
        if (this.status != StatusEntrega.EM_ROTA) {
            throw new EstadoInvalidoException("Entrega só pode ser concluída se estiver EM_ROTA. Status atual: " + this.status);
        }
        this.status = StatusEntrega.ENTREGUE;
        this.dataConclusao = LocalDateTime.now();
    }

    public void cancelar() {
        if (this.status != StatusEntrega.CRIADO) {
            throw new EstadoInvalidoException("Entrega está com status diferente de CRIADO");
        }
        this.status = StatusEntrega.CANCELADO;
        this.dataConclusao = LocalDateTime.now();
    }

    public void registrarFalha() {
        if (this.status != StatusEntrega.EM_ROTA) {
            throw new EstadoInvalidoException("Entrega não iniciada para registrar falha");
        }
        this.status = StatusEntrega.FALHA;
        this.dataConclusao = LocalDateTime.now();
    }
}