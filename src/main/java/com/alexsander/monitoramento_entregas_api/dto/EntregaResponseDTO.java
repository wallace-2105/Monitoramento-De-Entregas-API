package com.alexsander.monitoramento_entregas_api.dto;

import com.alexsander.monitoramento_entregas_api.model.Entrega;
import com.alexsander.monitoramento_entregas_api.model.StatusEntrega;
import com.alexsander.monitoramento_entregas_api.model.StatusEntregador;

import java.time.LocalDateTime;

public record EntregaResponseDTO(Long entregaId,
                                 Long pedidoId,
                                 Long entregadorId,
                                 StatusEntrega status,
                                 LocalDateTime dataInicio,
                                 LocalDateTime dataConclusao) {

    public EntregaResponseDTO(Entrega entrega){
        this(entrega.getId(),
                entrega.getPedido().getId(),
                entrega.getEntregador() != null ? entrega.getEntregador().getId() : null,
                entrega.getStatus(),
                entrega.getDataInicio(),
                entrega.getDataConclusao());
    }
}
