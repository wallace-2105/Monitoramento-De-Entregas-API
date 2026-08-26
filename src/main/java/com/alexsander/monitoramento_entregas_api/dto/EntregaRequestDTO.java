package com.alexsander.monitoramento_entregas_api.dto;

import jakarta.validation.constraints.NotNull;

public record EntregaRequestDTO(
        @NotNull
        Long pedidoId,
        @NotNull
        Long entregadorId) {
}
