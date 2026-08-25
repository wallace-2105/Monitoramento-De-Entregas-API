package com.alexsander.monitoramento_entregas_api.exception;

//classe para tratar erros de registros no BD, como quando nao acha um id no banco
//esta escrito de forma generica para tratar registros com retornos diferentes
public class RegistroNotFoundException extends RuntimeException {
    public RegistroNotFoundException(String mensagem) {
        super(mensagem);
    }
}
