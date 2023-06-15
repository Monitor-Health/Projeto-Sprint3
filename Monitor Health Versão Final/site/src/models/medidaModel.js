var database = require("../database/config");

function buscarUltimasMedidas(idFreezer) {

    instrucaoSql = ''

     if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucaoSql = `select * from monitorhealth.dados join sensor on dados.fkidsensor = sensor.id and dados.fktiposensor = sensor.tipo where dados.fkidsensor = ${idFreezer} order by dados.dt_hora desc limit 20`;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarMedidasEmTempoReal() {

    instrucaoSql = '';
    if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucaoSql = `select * from monitorhealth.dados`;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarAberturas(idFreezer) {

    instrucaoSql = '';
    if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucaoSql = `select count(valor) as aberturas from dados where dados.fktipoSensor = 1 and valor = 1 and fkidsensor = ${idFreezer};`;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarUltimasMedidas,
    buscarMedidasEmTempoReal,
    buscarAberturas
}
