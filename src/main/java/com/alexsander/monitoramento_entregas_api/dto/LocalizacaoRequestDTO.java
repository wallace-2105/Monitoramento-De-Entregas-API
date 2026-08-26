package com.alexsander.monitoramento_entregas_api.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record LocalizacaoRequestDTO(
        @NotNull(message = "Latitude é obrigatória.")
        @Min(value = -90, message = "Latitude inválida! O valor mínimo e -90.")
        @Max(value = 90, message = "Latitude inválida! O valor mínimo e 90.")
        Double latitude,
        @NotNull(message = "Longitude e obrigatória.")
        @Min(value = -180, message = "Longitude inválida! O valor mínimo e -180.")
        @Max(value = 180, message = "Longitude inválida! O valor mínimo e 180.")
        Double longitude,
        Long entregaId) {
}
