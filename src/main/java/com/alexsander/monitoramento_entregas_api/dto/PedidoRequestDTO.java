package com.alexsander.monitoramento_entregas_api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record PedidoRequestDTO(
        @NotBlank(message = "Nome é Obrigatório")
        String cliente,
        @NotBlank(message = "Endereço é Obrigatório")
        String enderecoEntrega,
        @NotBlank(message = "Cep do cliente e obrigatório")
        @Pattern(regexp = "\\d{5}-?\\d{3}", message = "CEP deve estar no formato 00000-000 ou 00000000")
        String cep
) {
}
