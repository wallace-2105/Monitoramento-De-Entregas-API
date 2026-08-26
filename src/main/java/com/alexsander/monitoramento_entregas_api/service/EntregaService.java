package com.alexsander.monitoramento_entregas_api.service;

import com.alexsander.monitoramento_entregas_api.dto.EntregaRequestDTO;
import com.alexsander.monitoramento_entregas_api.dto.EntregaResponseDTO;
import com.alexsander.monitoramento_entregas_api.exception.EstadoInvalidoException;
import com.alexsander.monitoramento_entregas_api.exception.RegistroNotFoundException;
import com.alexsander.monitoramento_entregas_api.model.*;
import com.alexsander.monitoramento_entregas_api.repository.EntregaRepository;
import com.alexsander.monitoramento_entregas_api.repository.EntregadorRepository;
import com.alexsander.monitoramento_entregas_api.repository.PedidoRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import java.util.List;


@Service
public class EntregaService {

    private final EntregaRepository entregaRepository;
    private final PedidoRepository pedidoRepository;
    private final EntregadorRepository entregadorRepository;

    public EntregaService(EntregadorRepository entregadorRepository, PedidoRepository pedidoRepository, EntregaRepository entregaRepository) {
        this.entregaRepository = entregaRepository;
        this.entregadorRepository = entregadorRepository;
        this.pedidoRepository = pedidoRepository;
    }

    @Transactional
    public EntregaResponseDTO criarEntrega(EntregaRequestDTO dto) {
        //Busca entregador e pedido pelo id e lança excessao caso nao encontrar
        Entregador entregador = entregadorRepository.findById(dto.entregadorId()).
                orElseThrow(() -> new RegistroNotFoundException("Entregador não encontrado"));
        Pedido pedido = pedidoRepository.findById(dto.pedidoId()).orElseThrow(() -> new RegistroNotFoundException("Pedido não encontrado"));

        //verifica se pedido esta com status da entrega como: ENTREGUE ou CANCELADO

        if (pedido.getStatus() != StatusPedido.PENDENTE) {
            throw new EstadoInvalidoException("Entrega não pode ser criada pois pedido esta: " + pedido.getStatus());
        }

        //verifica se entregador esta com status de: EM_ENTREGA ou OFFLINE
        if (entregador.getStatus() != StatusEntregador.DISPONIVEL) {
            throw new EstadoInvalidoException("Entregador não pode ser colocado nessa entrega pois esta: " + entregador.getStatus());
        }

        boolean existeEntregaEmAberto = entregaRepository.existsByPedidoIdAndStatusIn(pedido.getId(), List.of(StatusEntrega.CRIADO, StatusEntrega.EM_ROTA));

        if (existeEntregaEmAberto) {
            throw new EstadoInvalidoException("Já existe uma entrega em andamento para este pedido.");
        }

        Entrega entrega = new Entrega();

        entrega.setPedido(pedido);
        entrega.setEntregador(entregador);
        entrega.setStatus(StatusEntrega.CRIADO);

        entregaRepository.save(entrega);

        return new EntregaResponseDTO(entrega);
    }

    @Transactional
    public EntregaResponseDTO iniciarEntrega(Long id) {
        Entrega entrega = buscarOuFalhar(id);

        Pedido pedido = entrega.getPedido();
        Entregador entregador = entrega.getEntregador();

        if (entrega.getStatus() != StatusEntrega.CRIADO) {
            throw new EstadoInvalidoException("Entrega não pode ser iniciada. Status atual da entrega: " + entrega.getStatus());
        }

        if (pedido.getStatus() != StatusPedido.PENDENTE) {
            throw new EstadoInvalidoException("Entrega não pode ser iniciada. Status atual do pedido: " + pedido.getStatus());
        }

        if (entregador.getStatus() != StatusEntregador.DISPONIVEL) {
            throw new EstadoInvalidoException("Entrega não pode ser iniciada. Status atual do entregador: " + entregador.getStatus());
        }

        pedido.setStatus(StatusPedido.EM_ROTA);
        entrega.setStatus(StatusEntrega.EM_ROTA);
        entregador.setStatus(StatusEntregador.EM_ENTREGA);
        entrega.setDataInicio(LocalDateTime.now());

        entregadorRepository.save(entregador);
        pedidoRepository.save(pedido);
        Entrega entregaSalva = entregaRepository.save(entrega);

        return new EntregaResponseDTO(entregaSalva);
    }

    @Transactional
    public EntregaResponseDTO concluirEntrega(Long id) {
        Entrega entrega = buscarOuFalhar(id);

        Pedido pedido = entrega.getPedido();
        Entregador entregador = entrega.getEntregador();

        if (entrega.getStatus() != StatusEntrega.EM_ROTA) {
            throw new EstadoInvalidoException("Entrega só pode ser concluída se estiver com status: " + entrega.getStatus());
        }

        if (pedido.getStatus() != StatusPedido.EM_ROTA) {
            throw new EstadoInvalidoException("Pedido só pode ser concluído se estiver com status: " + entrega.getStatus());
        }

        entrega.setStatus(StatusEntrega.ENTREGUE);
        pedido.setStatus(StatusPedido.ENTREGUE);
        entregador.setStatus(StatusEntregador.DISPONIVEL);
        entrega.setDataConclusao(LocalDateTime.now());

        Entrega entregaAtualizada = entregaRepository.save(entrega);

        return new EntregaResponseDTO(entregaAtualizada);
    }

    @Transactional
    public EntregaResponseDTO cancelarEntrega(Long id) {
        Entrega entrega = buscarOuFalhar(id);

        Pedido pedido = entrega.getPedido();
        Entregador entregador = entrega.getEntregador();

        if (entrega.getStatus() != StatusEntrega.CRIADO) {
            throw new EstadoInvalidoException("Entrega esta com status diferente de CRIADO");
        }

        entrega.setStatus(StatusEntrega.CANCELADO);
        pedido.setStatus(StatusPedido.PENDENTE);
        entregador.setStatus(StatusEntregador.DISPONIVEL);
        entrega.setDataConclusao(LocalDateTime.now());

        Entrega entregaCancelada = entregaRepository.save(entrega);
        return new EntregaResponseDTO(entregaCancelada);
    }

    @Transactional
    public EntregaResponseDTO registrarFalhaNaEntrega(Long id) {
        Entrega entrega = buscarOuFalhar(id);

        Pedido pedido = entrega.getPedido();
        Entregador entregador = entrega.getEntregador();

        if (entrega.getStatus() != StatusEntrega.EM_ROTA) {
            throw new EstadoInvalidoException("Entrega não iniciada para registrar falha");
        }

        if (pedido.getStatus() != StatusPedido.EM_ROTA) {
            throw new EstadoInvalidoException("A entrega desse pedido não foi iniciada");
        }

        entrega.setStatus(StatusEntrega.FALHA);
        pedido.setStatus(StatusPedido.FALHA);
        entregador.setStatus(StatusEntregador.DISPONIVEL);
        entrega.setDataConclusao(LocalDateTime.now());

        Entrega entregaComFalha = entregaRepository.save(entrega);

        return new EntregaResponseDTO(entregaComFalha);
    }

    public Page<EntregaResponseDTO> listarEntregas(Pageable paginacao) {
        return entregaRepository.findAll(paginacao).map(EntregaResponseDTO::new);
    }

    public List<EntregaResponseDTO> listarEntregasAtivas() {
        return entregaRepository.findByStatus(StatusEntrega.EM_ROTA)
                .stream()
                .map(EntregaResponseDTO::new)
                .toList();
    }

    public EntregaResponseDTO buscarEntregaPorId(Long id) {
        Entrega entrega = buscarOuFalhar(id);
        return new EntregaResponseDTO(entrega);
    }

    private Entrega buscarOuFalhar(Long id) {
        return entregaRepository.findById(id)
                .orElseThrow(() -> new RegistroNotFoundException("Entrega não encontrada"));
    }

}