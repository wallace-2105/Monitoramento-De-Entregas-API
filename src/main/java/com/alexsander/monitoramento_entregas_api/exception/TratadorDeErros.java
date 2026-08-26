package com.alexsander.monitoramento_entregas_api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class TratadorDeErros {

    @ExceptionHandler(ValidacaoException.class)
    public ResponseEntity<ErroResposta> tratarErroValidacao(ValidacaoException ex){
        var erro = new ErroResposta(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return ResponseEntity.badRequest().body(erro);
    }

    @ExceptionHandler(RegistroNotFoundException.class)
    public ResponseEntity<ErroResposta> tratarRegistro(RegistroNotFoundException ex){
       var erro = new ErroResposta(HttpStatus.NOT_FOUND.value(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erro);
    }

    @ExceptionHandler(EstadoInvalidoException.class)
    public ResponseEntity<ErroResposta> tratarConflito(EstadoInvalidoException ex){
        var erro = new ErroResposta(HttpStatus.CONFLICT.value(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(erro);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErroResposta> tratarErroGenerico(Exception ex){
        var erro = new ErroResposta(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Erro interno no servidor");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(erro);
    }


    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity tratarErro400(MethodArgumentNotValidException ex){
        var erros = ex.getFieldErrors();
        return ResponseEntity.badRequest().body(erros.stream().map(DadosErrosValidacao::new).toList());
    }

    public record DadosErrosValidacao(String campo, String mensagem){

        public DadosErrosValidacao(FieldError erro){
            this(erro.getField(), erro.getDefaultMessage());
        }
    }

    public record ErroResposta(int status,String mensagem){}
}
