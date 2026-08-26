package com.alexsander.monitoramento_entregas_api.dto;

import com.alexsander.monitoramento_entregas_api.model.Localizacao;

import java.time.LocalDateTime;

public record LocalizacaoResponseDTO(Long id,
                                     Double latitude,
                                     Double longitude,
                                     LocalDateTime dataHora,
                                     Long entregaId) {

    public LocalizacaoResponseDTO(Localizacao localizacao){
        this(localizacao.getId(), localizacao.getLatitude(),localizacao.getLongitude(),localizacao.getDataHora(),localizacao.getEntrega().getId());
    }
}
