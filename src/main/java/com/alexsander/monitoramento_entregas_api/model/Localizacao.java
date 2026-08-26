package com.alexsander.monitoramento_entregas_api.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "localizacoes")
public class Localizacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double latitude;
    private Double longitude;

    private LocalDateTime dataHora;

    @ManyToOne
    private Entrega entrega;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public Entrega getEntrega() {
        return entrega;
    }

    public void setEntrega(Entrega entrega) {
        this.entrega = entrega;
    }

    public static Localizacao criar(Entrega entrega, Double latitude, Double  longitude){
        Localizacao localizacao = new Localizacao();
        localizacao.entrega = entrega;
        localizacao.latitude = latitude;
        localizacao.longitude = longitude;
        localizacao.dataHora = LocalDateTime.now();
        return localizacao;
    }
}
