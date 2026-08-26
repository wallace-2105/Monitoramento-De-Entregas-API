package com.alexsander.monitoramento_entregas_api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record EntregadorRequestDTO(
        @NotBlank(message = "Nome do entregador e obrigatório")
        String nome,
        @NotBlank(message = "Telefone é obrigatório")
        String telefone) {
}
