package com.alexsander.monitoramento_entregas_api.controller;

import com.alexsander.monitoramento_entregas_api.dto.PedidoRequestDTO;
import com.alexsander.monitoramento_entregas_api.dto.PedidoResponseDTO;
import com.alexsander.monitoramento_entregas_api.service.PedidoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    private final PedidoService service;

    public PedidoController(PedidoService service){
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<PedidoResponseDTO> criarPedido(@RequestBody @Valid PedidoRequestDTO dto, UriComponentsBuilder uriBuilder){
        var response = service.criarPedido(dto);
        var uri = uriBuilder.path("/pedidos/{id}").buildAndExpand(response.id()).toUri();
        return ResponseEntity.created(uri).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<PedidoResponseDTO>> listarPedidos(@PageableDefault(size = 5, sort = {"dataCriacao"}, direction = Sort.Direction.DESC)Pageable paginacao){
        var page = service.listarPedidos(paginacao);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoResponseDTO> buscarPedidoPorId(@PathVariable Long id){
        var pedido = service.buscarPedidoPorId(id);
        return ResponseEntity.ok(pedido);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PedidoResponseDTO> atualizarPedidoPorId(@PathVariable Long id, @RequestBody @Valid PedidoRequestDTO dto){
        var response = service.atualizarPedido(id,dto);
        return ResponseEntity.accepted().body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deletarPedido(@PathVariable Long id){
        service.deletarPedido(id);
        return ResponseEntity.noContent().build();
    }

}
