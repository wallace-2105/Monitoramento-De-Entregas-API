package com.alexsander.monitoramento_entregas_api.exception;

//classe criada para tratar erros de conflito de estado,
//como uma entrega finalizada e o cliente querendo iniciar ela, isso e um conflito de estado
public class EstadoInvalidoException extends RuntimeException{
    public EstadoInvalidoException(String mensagem){
         super(mensagem);
    }
}
