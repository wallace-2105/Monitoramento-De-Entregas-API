package com.alexsander.monitoramento_entregas_api.model;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "localizacoes")
@Getter
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Localizacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false)
    private LocalDateTime dataHora;

    @ManyToOne
    @JoinColumn(name = "entrega_id", nullable = false, foreignKey = @ForeignKey(name = "fk_localizacao_entrega"))
    private Entrega entrega;

    public static Localizacao criar(Entrega entrega, Double latitude, Double longitude) {
        Localizacao localizacao = new Localizacao();
        localizacao.entrega = entrega;
        localizacao.latitude = latitude;
        localizacao.longitude = longitude;
        localizacao.dataHora = LocalDateTime.now();
        return localizacao;
    }
}