package com.alexsander.monitoramento_entregas_api.controller;

import com.alexsander.monitoramento_entregas_api.dto.LocalizacaoRequestDTO;
import com.alexsander.monitoramento_entregas_api.dto.LocalizacaoResponseDTO;
import com.alexsander.monitoramento_entregas_api.dto.LocalizacaoWebSocketRequestDTO;
import com.alexsander.monitoramento_entregas_api.dto.LocalizacaoWebSocketResponseDTO;
import com.alexsander.monitoramento_entregas_api.model.Localizacao;
import com.alexsander.monitoramento_entregas_api.service.LocalizacaoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;


@RestController
@RequestMapping("/localizacoes")
public class LocalizacaoController {

    private final SimpMessagingTemplate messagingTemplate;
    private final LocalizacaoService service;

    public LocalizacaoController(SimpMessagingTemplate messagingTemplate, LocalizacaoService service) {
        this.messagingTemplate = messagingTemplate;
        this.service = service;
    }

    @MessageMapping("/entregas/{entregaId}/localizacao")
    public void receberLocalizacao(@DestinationVariable Long entregaId, @Valid @Payload LocalizacaoWebSocketRequestDTO dto) {
        Localizacao salva = service.registrarLocalizacao(entregaId, dto.latitude(), dto.longitude());
        var response = new LocalizacaoWebSocketResponseDTO(salva);
        messagingTemplate.convertAndSend("/topic/entregas/" + entregaId, response);
    }

    @PostMapping
    public ResponseEntity<LocalizacaoResponseDTO> criarLocalizacao(@RequestBody @Valid LocalizacaoRequestDTO dto, UriComponentsBuilder uriBuilder) {
        Localizacao salva = service.registrarLocalizacao(dto.entregaId(), dto.latitude(), dto.longitude());
        var response = new LocalizacaoResponseDTO(salva);
        var uri = uriBuilder.path("/localizacoes/{id}").buildAndExpand(response.id()).toUri();
        return ResponseEntity.created(uri).body(response);
    }

    @GetMapping
    public ResponseEntity<List<LocalizacaoResponseDTO>> listarLocalizacoes() {
        var response = service.listarLocalizacoes();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LocalizacaoResponseDTO> buscarLocalizacaoPorId(@PathVariable Long id) {
        var response = service.buscarLocalizacaoPorId(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/entrega/{entregaId}")
    public ResponseEntity<List<LocalizacaoResponseDTO>> listarLocalizacaoPorEntrega(@PathVariable Long entregaId) {
        var response = service.listarLocalizacaoPorEntrega(entregaId);
        return ResponseEntity.ok(response);
    }
}
