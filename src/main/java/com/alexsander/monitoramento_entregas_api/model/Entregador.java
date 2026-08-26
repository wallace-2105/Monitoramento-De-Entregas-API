package com.alexsander.monitoramento_entregas_api.model;

import com.alexsander.monitoramento_entregas_api.exception.EstadoInvalidoException;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "entregadores")
@Getter
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Entregador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @Column(nullable = false)
    private String nome;

    @Setter
    @Column(unique = true, nullable = false)
    private String telefone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusEntregador status;

    public static Entregador criar(String nome, String telefone) {
        Entregador entregador = new Entregador();
        entregador.nome = nome;
        entregador.telefone = telefone;
        entregador.status = StatusEntregador.DISPONIVEL;
        return entregador;
    }

    // Transições de status - sem setter público, só métodos de negócio

    public void colocarEmEntrega() {
        if (this.status != StatusEntregador.DISPONIVEL) {
            throw new EstadoInvalidoException("Entregador não pode ser colocado em entrega. Status atual: " + this.status);
        }
        this.status = StatusEntregador.EM_ENTREGA;
    }

    public void liberar() {
        if (this.status != StatusEntregador.EM_ENTREGA) {
            throw new EstadoInvalidoException("Entregador não pode ser liberado. Status atual: " + this.status);
        }
        this.status = StatusEntregador.DISPONIVEL;
    }
}