package com.alexsander.monitoramento_entregas_api.controller;

import com.alexsander.monitoramento_entregas_api.dto.EntregadorRequestDTO;
import com.alexsander.monitoramento_entregas_api.dto.EntregadorResponseDTO;
import com.alexsander.monitoramento_entregas_api.service.EntregadorService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;



@RestController
@RequestMapping("/entregadores")
public class EntregadorController {

    private final EntregadorService service;

    public EntregadorController(EntregadorService service){
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<EntregadorResponseDTO> criarEntregador(@RequestBody @Valid EntregadorRequestDTO dto, UriComponentsBuilder uriBuilder){
        var response = service.criarEntregador(dto);
        var uri = uriBuilder.path("/entregadores/{id}").buildAndExpand(response.id()).toUri();
        return ResponseEntity.created(uri).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<EntregadorResponseDTO>> listarEntregadores(@PageableDefault(size = 5, sort = {"status"}, direction = Sort.Direction.DESC)Pageable paginacao){
        var page = service.listarEntregadores(paginacao);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntregadorResponseDTO> buscarEntregadorPorId(@PathVariable Long id){
        var response = service.buscarEntregadorPorId(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EntregadorResponseDTO> atualizarEntregador(@PathVariable Long id, @RequestBody @Valid EntregadorRequestDTO dto){
         var response = service.atualizarEntregador(id, dto);
         return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deletarEntregador(@PathVariable Long id){
        service.deletarEntregador(id);
        return ResponseEntity.noContent().build();
    }

}
