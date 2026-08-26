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
        Entregador entregador = entregadorRepository.findById(dto.entregadorId())
                .orElseThrow(() -> new RegistroNotFoundException("Entregador não encontrado"));
        Pedido pedido = pedidoRepository.findById(dto.pedidoId())
                .orElseThrow(() -> new RegistroNotFoundException("Pedido não encontrado"));

        if (pedido.getStatus() != StatusPedido.PENDENTE) {
            throw new EstadoInvalidoException("Entrega não pode ser criada pois pedido esta: " + pedido.getStatus());
        }

        if (entregador.getStatus() != StatusEntregador.DISPONIVEL) {
            throw new EstadoInvalidoException("Entregador não pode ser colocado nessa entrega pois esta: " + entregador.getStatus());
        }

        boolean existeEntregaEmAberto = entregaRepository.existsByPedidoIdAndStatusIn(
                pedido.getId(), List.of(StatusEntrega.CRIADO, StatusEntrega.EM_ROTA));

        if (existeEntregaEmAberto) {
            throw new EstadoInvalidoException("Já existe uma entrega em andamento para este pedido.");
        }

        Entrega entrega = Entrega.criar(pedido, entregador);
        Entrega entregaSalva = entregaRepository.save(entrega);

        return new EntregaResponseDTO(entregaSalva);
    }

    @Transactional
    public EntregaResponseDTO iniciarEntrega(Long id) {
        Entrega entrega = buscarOuFalhar(id);
        Pedido pedido = entrega.getPedido();
        Entregador entregador = entrega.getEntregador();

        entrega.iniciar();
        pedido.iniciarRota();
        entregador.colocarEmEntrega();

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

        entrega.concluir();
        pedido.concluir();
        entregador.liberar();

        entregadorRepository.save(entregador);
        pedidoRepository.save(pedido);
        Entrega entregaAtualizada = entregaRepository.save(entrega);

        return new EntregaResponseDTO(entregaAtualizada);
    }

    @Transactional
    public EntregaResponseDTO cancelarEntrega(Long id) {
        Entrega entrega = buscarOuFalhar(id);
        Pedido pedido = entrega.getPedido();
        Entregador entregador = entrega.getEntregador();

        entrega.cancelar();
        pedido.voltarParaPendente();
        entregador.liberar();

        entregadorRepository.save(entregador);
        pedidoRepository.save(pedido);
        Entrega entregaCancelada = entregaRepository.save(entrega);

        return new EntregaResponseDTO(entregaCancelada);
    }

    @Transactional
    public EntregaResponseDTO registrarFalhaNaEntrega(Long id) {
        Entrega entrega = buscarOuFalhar(id);
        Pedido pedido = entrega.getPedido();
        Entregador entregador = entrega.getEntregador();

        entrega.registrarFalha();
        pedido.registrarFalha();
        entregador.liberar();

        entregadorRepository.save(entregador);
        pedidoRepository.save(pedido);
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