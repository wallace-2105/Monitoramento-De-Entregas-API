package com.alexsander.monitoramento_entregas_api.service;

import com.alexsander.monitoramento_entregas_api.dto.PedidoRequestDTO;
import com.alexsander.monitoramento_entregas_api.dto.PedidoResponseDTO;
import com.alexsander.monitoramento_entregas_api.exception.RegistroNotFoundException;
import com.alexsander.monitoramento_entregas_api.model.Pedido;
import com.alexsander.monitoramento_entregas_api.repository.PedidoRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


@Service
public class PedidoService {

    private final PedidoRepository repository;

    public PedidoService(PedidoRepository  repository){
        this.repository = repository;
    }

    @Transactional
    public PedidoResponseDTO criarPedido(PedidoRequestDTO dto) {
        //metodo criar na entidade ja setando o pedido pendente e a data de criacao
        Pedido pedido = Pedido.criar(dto.cliente(), dto.enderecoEntrega(), dto.cep());
        Pedido pedidoSalvo = repository.save(pedido);
        return new PedidoResponseDTO(pedidoSalvo);
    }

    public Page<PedidoResponseDTO> listarPedidos(Pageable paginacao) {
        return repository.findAll(paginacao).map(PedidoResponseDTO::new);
    }

    public PedidoResponseDTO buscarPedidoPorId(Long id) {
        Pedido pedido = buscarOuFalhar(id);
        return new PedidoResponseDTO(pedido);
    }

    @Transactional
    public PedidoResponseDTO atualizarPedido(Long id, PedidoRequestDTO dto) {
        Pedido pedido = buscarOuFalhar(id);

        pedido.setCliente(dto.cliente());
        pedido.setEnderecoEntrega(dto.enderecoEntrega());
        pedido.setCep(dto.cep());

        return new PedidoResponseDTO(pedido);
    }

    @Transactional
    public void deletarPedido(Long id) {
        Pedido pedido = buscarOuFalhar(id);
        repository.delete(pedido);
    }

    private Pedido buscarOuFalhar(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RegistroNotFoundException("Pedido não encontrado"));
    }
}
