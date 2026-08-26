package com.alexsander.monitoramento_entregas_api.dto;

import com.alexsander.monitoramento_entregas_api.model.Localizacao;

import java.time.LocalDateTime;

public record LocalizacaoWebSocketResponseDTO(Long localizacaoId,
                                              Long entregaId,
                                              Double latitude,
                                              Double longitude,
                                              LocalDateTime dataHora) {

    public LocalizacaoWebSocketResponseDTO(Localizacao localizacao){
        this(localizacao.getId(), localizacao.getEntrega().getId(), localizacao.getLatitude(), localizacao.getLongitude(), localizacao.getDataHora());
    }
}
