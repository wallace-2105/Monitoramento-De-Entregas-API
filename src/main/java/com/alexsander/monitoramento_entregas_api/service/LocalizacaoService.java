package com.alexsander.monitoramento_entregas_api.service;

import com.alexsander.monitoramento_entregas_api.dto.LocalizacaoResponseDTO;
import com.alexsander.monitoramento_entregas_api.exception.EstadoInvalidoException;
import com.alexsander.monitoramento_entregas_api.exception.RegistroNotFoundException;
import com.alexsander.monitoramento_entregas_api.model.Entrega;
import com.alexsander.monitoramento_entregas_api.model.Localizacao;
import com.alexsander.monitoramento_entregas_api.model.StatusEntrega;
import com.alexsander.monitoramento_entregas_api.repository.EntregaRepository;
import com.alexsander.monitoramento_entregas_api.repository.LocalizacaoRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class LocalizacaoService {

    private final LocalizacaoRepository localizacaoRepository;
    private final EntregaRepository entregaRepository;

    public LocalizacaoService(LocalizacaoRepository localizacaoRepository, EntregaRepository entregaRepository){
        this.localizacaoRepository = localizacaoRepository;
        this.entregaRepository = entregaRepository;
    }

    @Transactional
    public Localizacao registrarLocalizacao(Long entregaId, Double latitude, Double longitude) {
        Entrega entrega = buscaOuFalha(entregaId);

        if (entrega.getStatus() != StatusEntrega.EM_ROTA) {
            throw new EstadoInvalidoException("Só é possível registrar uma localização com uma entrega EM_ROTA");
        }

        Localizacao localizacao = Localizacao.criar(entrega, latitude, longitude);
        return localizacaoRepository.save(localizacao);
    }

    public List<LocalizacaoResponseDTO> listarLocalizacoes() {
        return localizacaoRepository.findAll()
                .stream()
                .map(LocalizacaoResponseDTO::new)
                .toList();
    }

    public LocalizacaoResponseDTO buscarLocalizacaoPorId(Long id) {
        Localizacao localizacao = buscaOuFalhaLocalizacao(id);
        return new LocalizacaoResponseDTO(localizacao);
    }

    public List<LocalizacaoResponseDTO> listarLocalizacaoPorEntrega(Long entregaId) {
        Entrega entrega = buscaOuFalha(entregaId);

        List<Localizacao> listaDeLocalizacoes = localizacaoRepository.findByEntregaId(entregaId);

        return listaDeLocalizacoes
                .stream()
                .map(LocalizacaoResponseDTO::new)
                .toList();
    }

    private Entrega buscaOuFalha(Long id) {
        return entregaRepository.findById(id)
                .orElseThrow(() -> new RegistroNotFoundException("Entrega não encontrada."));
    }

    private Localizacao buscaOuFalhaLocalizacao(Long id) {
        return localizacaoRepository.findById(id)
                .orElseThrow(() -> new RegistroNotFoundException("Localização não encontrada."));
    }
}

