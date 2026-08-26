package com.alexsander.monitoramento_entregas_api.service;

import com.alexsander.monitoramento_entregas_api.dto.EntregadorRequestDTO;
import com.alexsander.monitoramento_entregas_api.dto.EntregadorResponseDTO;
import com.alexsander.monitoramento_entregas_api.exception.RegistroNotFoundException;
import com.alexsander.monitoramento_entregas_api.model.Entregador;
import com.alexsander.monitoramento_entregas_api.repository.EntregadorRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


@Service
public class EntregadorService {

    private final EntregadorRepository repository;

    public EntregadorService(EntregadorRepository repository){
        this.repository = repository;
    }

    @Transactional
    public EntregadorResponseDTO criarEntregador(EntregadorRequestDTO dto) {
        Entregador entregador = Entregador.criar(dto.nome(), dto.telefone());
        Entregador entregadorSalvo = repository.save(entregador);
        return new EntregadorResponseDTO(entregadorSalvo);
    }

    public Page<EntregadorResponseDTO> listarEntregadores(Pageable paginacao) {
        return repository.findAll(paginacao).map(EntregadorResponseDTO::new);
    }

    public EntregadorResponseDTO buscarEntregadorPorId(Long id) {
        Entregador entregador = buscaOuFalha(id);
        return new EntregadorResponseDTO(entregador);
    }

    @Transactional
    public EntregadorResponseDTO atualizarEntregador(Long id, EntregadorRequestDTO dto) {
        Entregador entregador = buscaOuFalha(id);

        entregador.setNome(dto.nome());
        entregador.setTelefone(dto.telefone());

        return new EntregadorResponseDTO(entregador);
    }

    @Transactional
    public void deletarEntregador(Long id) {
        Entregador entregador = buscaOuFalha(id);
        repository.delete(entregador);
    }

    private Entregador buscaOuFalha(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RegistroNotFoundException("Entregador  não encontrado."));
    }
}
