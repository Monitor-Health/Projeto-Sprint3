var database = require("../database/config")

function entrar(email, senha) {
    var instrucao = `
        SELECT * FROM usuario WHERE email = '${email}' AND senha = '${senha}';
    `;
    return database.executar(instrucao);
}

function cadastrar(usuario, permissao){
    var instrucao = `
        INSERT INTO usuario (email, senha, fkPermissao, fkEmpresa) VALUES ('${usuario.email}', '${usuario.senha}', '${permissao}', '1');
    `;

    return database.executar(instrucao);
}

function listar(){
    var instrucao = `
        SELECT * from usuario where fkempresa = 1;
    ` 
    return database.executar(instrucao);
}

module.exports = {
    entrar,
    cadastrar,
    listar
};