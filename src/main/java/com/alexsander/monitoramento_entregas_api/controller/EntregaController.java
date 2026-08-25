package com.alexsander.monitoramento_entregas_api.controller;

import com.alexsander.monitoramento_entregas_api.dto.EntregaRequestDTO;
import com.alexsander.monitoramento_entregas_api.dto.EntregaResponseDTO;

import com.alexsander.monitoramento_entregas_api.service.EntregaService;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;

@RestController
@RequestMapping("/entregas")
public class EntregaController {

    @Autowired
    private EntregaService service;

    @PostMapping
    public ResponseEntity<EntregaResponseDTO> criarEntrega(@RequestBody @Valid EntregaRequestDTO dto, UriComponentsBuilder uriBuilder){
        var response = service.criarEntrega(dto);
        var uri = uriBuilder.path("/entregas/{id}").buildAndExpand(response.entregaId()).toUri();
        return ResponseEntity.created(uri).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<EntregaResponseDTO>> listarEntregas(@PageableDefault(size = 5, sort = {"dataInicio"}, direction = Sort.Direction.DESC)Pageable paginacao){
        var page = service.listarEntregas(paginacao);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntregaResponseDTO> buscarEntregaPorId(@PathVariable Long id){
        var entrega = service.buscarEntregaPorId(id);
        return ResponseEntity.ok(entrega);
    }

    @PutMapping("/{id}/iniciar")
    public ResponseEntity<EntregaResponseDTO> iniciarEntrega(@PathVariable Long id){
        var response = service.iniciarEntrega(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/concluir")
    public ResponseEntity<EntregaResponseDTO> concluirEntrega(@PathVariable Long id){
        var response = service.concluirEntrega(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<EntregaResponseDTO> cancelarEntrega(@PathVariable Long id){
        var response = service.cancelarEntrega(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/falha")
    public ResponseEntity<EntregaResponseDTO> registrarFalhaNaEntrega(@PathVariable Long id){
        var response = service.registrarFalhaNaEntrega(id);
        return ResponseEntity.ok(response);
    }


}
