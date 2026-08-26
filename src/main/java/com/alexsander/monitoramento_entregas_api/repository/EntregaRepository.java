package com.alexsander.monitoramento_entregas_api.repository;

import com.alexsander.monitoramento_entregas_api.model.Entrega;
import com.alexsander.monitoramento_entregas_api.model.StatusEntrega;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface EntregaRepository extends JpaRepository<Entrega, Long> {

    boolean existsByPedidoIdAndStatusIn(Long pedidoId, List<StatusEntrega> status);

    List<Entrega> findByStatus(StatusEntrega statusEntrega);
}
