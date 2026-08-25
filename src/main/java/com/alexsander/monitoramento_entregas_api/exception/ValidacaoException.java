package com.alexsander.monitoramento_entregas_api.exception;

//Excessao para tratar erros de validação da api
public class ValidacaoException  extends RuntimeException{
    public ValidacaoException(String mensagem){
        super(mensagem);
    }
}
