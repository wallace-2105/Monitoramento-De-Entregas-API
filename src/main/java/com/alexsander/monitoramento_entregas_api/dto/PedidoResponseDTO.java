package com.alexsander.monitoramento_entregas_api.dto;

import com.alexsander.monitoramento_entregas_api.model.Pedido;
import com.alexsander.monitoramento_entregas_api.model.StatusPedido;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public record PedidoResponseDTO(
        Long id,
        String cliente,
        String enderecoEntrega,
        String cep,
        StatusPedido status,
        LocalDateTime dataCriacao) {

    public PedidoResponseDTO(Pedido pedido){
        this(pedido.getId(), pedido.getCliente(), pedido.getEnderecoEntrega(), pedido.getCep(), pedido.getStatus(),pedido.getDataCriacao());
    }
}
