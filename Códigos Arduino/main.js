// não altere!
const serialport = require('serialport');
const express = require('express');
const mysql = require('mysql2');
const sql = require('mssql');

// não altere!
const SERIAL_BAUD_RATE = 9600;
const SERVIDOR_PORTA = 3300;

// configure a linha abaixo caso queira que os dados capturados sejam inseridos no banco de dados.
// false -> nao insere
// true -> insere
const HABILITAR_OPERACAO_INSERIR = true;

// altere o valor da variável AMBIENTE para o valor desejado:
// API conectada ao banco de dados remoto, SQL Server -> 'producao'
// API conectada ao banco de dados local, MySQL Workbench - 'desenvolvimento'
const AMBIENTE = 'desenvolvimento';

const serial = async (
    valoresLm35Temperatura,
    valoresLm35TemperaturaFreezer2,
    valoresLm35TemperaturaFreezer3,
    valoresLm35TemperaturaFreezer4,
    valoresLm35TemperaturaFreezer5,
    valoresChave,
    valoresChaveFreezer2,
    valoresChaveFreezer3,
    valoresChaveFreezer4,
    valoresChaveFreezer5
) => {
    let poolBancoDados = ''

    if (AMBIENTE == 'desenvolvimento') {
        poolBancoDados = mysql.createPool(
            {
                // altere!
                // CREDENCIAIS DO BANCO LOCAL - MYSQL WORKBENCH
                host: "10.18.33.0",
                database: "monitorhealth",
                user: "teste",
                password: "urubu100"
            }
        ).promise();
    } else if (AMBIENTE == 'producao') {
        console.log('Projeto rodando inserindo dados em nuvem. Configure as credenciais abaixo.');
    } else {
        throw new Error('Ambiente não configurado. Verifique o arquivo "main.js" e tente novamente.');
    }


    const portas = await serialport.SerialPort.list();
    const portaArduino = portas.find((porta) => porta.vendorId == 2341 && porta.productId == 43);
    if (!portaArduino) {
        throw new Error('O arduino não foi encontrado em nenhuma porta serial');
    }
    const arduino = new serialport.SerialPort(
        {
            path: portaArduino.path,
            baudRate: SERIAL_BAUD_RATE
        }
    );
    arduino.on('open', () => {
        console.log(`A leitura do arduino foi iniciada na porta ${portaArduino.path} utilizando Baud Rate de ${SERIAL_BAUD_RATE}`);
    });
    arduino.pipe(new serialport.ReadlineParser({ delimiter: '\r\n' })).on('data', async (data) => {
        //Real
        const valores = data.split(';');
        const lm35Temperatura = parseFloat(valores[0]);
        const chave = parseInt(valores[1]);

        // Congelante
        const lm35TemperaturaFreezer2 = parseFloat(valores[2]);
        const chaveFreezer2 = parseInt(valores[3]);

        // Derretendo
        const lm35TemperaturaFreezer3 = parseFloat(valores[4]);
        const chaveFreezer3 = parseInt(valores[5]);

        //Fria
        const lm35TemperaturaFreezer4 = parseFloat(valores[6]);
        const chaveFreezer4 = parseInt(valores[7]);

        //Quente
        const lm35TemperaturaFreezer5 = parseFloat(valores[8]);
        const chaveFreezer5 = parseInt(valores[9]);

        valoresLm35Temperatura.push(lm35Temperatura);
        valoresLm35TemperaturaFreezer2.push(lm35TemperaturaFreezer2);
        valoresLm35TemperaturaFreezer3.push(lm35TemperaturaFreezer3);
        valoresLm35TemperaturaFreezer4.push(lm35TemperaturaFreezer4);
        valoresLm35TemperaturaFreezer5.push(lm35TemperaturaFreezer5);
        valoresChave.push(chave);
        valoresChaveFreezer2.push(chaveFreezer2);
        valoresChaveFreezer3.push(chaveFreezer3);
        valoresChaveFreezer4.push(chaveFreezer4);
        valoresChaveFreezer5.push(chaveFreezer5);
        if (HABILITAR_OPERACAO_INSERIR) {
            if (AMBIENTE == 'producao') {
                // altere!
                // Este insert irá inserir os dados na tabela "medida"
                // -> altere nome da tabela e colunas se necessário
                // Este insert irá inserir dados de fk_aquario id=1 (fixo no comando do insert abaixo)
                // >> Importante! você deve ter o aquario de id 1 cadastrado.
                sqlquery = `INSERT INTO medida (dht11_umidade, dht11_temperatura, luminosidade, lm35_temperatura, chave, momento, fk_aquario) VALUES (${dht11Umidade}, ${dht11Temperatura}, ${luminosidade}, ${lm35Temperatura}, ${chave}, CURRENT_TIMESTAMP, 1)`;

                // CREDENCIAIS DO BANCO REMOTO - SQL SERVER
                // Importante! você deve ter criado o usuário abaixo com os comandos presentes no arquivo
                // "script-criacao-usuario-sqlserver.sql", presente neste diretório.
                const connStr = "Server=servidor-acquatec.database.windows.net;Database=bd-acquatec;User Id=usuarioParaAPIArduino_datawriter;Password=#Gf_senhaParaAPI;";

                function inserirComando(conn, sqlquery) {
                    conn.query(sqlquery);
                    console.log("valores inseridos no banco: ", dht11Umidade + ", " + dht11Temperatura + ", " + luminosidade + ", " + lm35Temperatura + ", " + chave)
                }

                sql.connect(connStr)
                    .then(conn => inserirComando(conn, sqlquery))
                    .catch(err => console.log("erro! " + err));

            } else if (AMBIENTE == 'desenvolvimento') {

                // altere!
                // Este insert irá inserir os dados na tabela "medida"
                // -> altere nome da tabela e colunas se necessário
                // Este insert irá inserir dados de fk_aquario id=1 (fixo no comando do insert abaixo)
                // >> você deve ter o aquario de id 1 cadastrado.
                await poolBancoDados.execute(
                    `INSERT INTO dados VALUES (DEFAULT, ${lm35Temperatura}, now(), 1, 2),
                    (DEFAULT, ${lm35TemperaturaFreezer2}, now(), 2, 2),
                    (DEFAULT, ${lm35TemperaturaFreezer3}, now(), 3, 2),
                    (DEFAULT, ${lm35TemperaturaFreezer4}, now(), 4, 2),
                    (DEFAULT, ${lm35TemperaturaFreezer5}, now(), 5, 2);`
                );
                setTimeout(() => { }, 3000);
                await poolBancoDados.execute(
                    `INSERT INTO dados VALUES (DEFAULT, ${chave}, now(), 1, 1),
                    (DEFAULT, ${chaveFreezer2}, now(), 2, 1),
                    (DEFAULT, ${chaveFreezer3}, now(), 3, 1),
                    (DEFAULT, ${chaveFreezer4}, now(), 4, 1),
                    (DEFAULT, ${chaveFreezer5}, now(), 5, 1);`
                )

            } else {
                throw new Error('Ambiente não configurado. Verifique o arquivo "main.js" e tente novamente.');
            }
        }
    });
    arduino.on('error', (mensagem) => {
        console.error(`Erro no arduino (Mensagem: ${mensagem}`)
    });
}


// não altere!
const servidor = (
    valoresLm35Temperatura,
    valoresLm35TemperaturaFreezer2,
    valoresLm35TemperaturaFreezer3,
    valoresLm35TemperaturaFreezer4,
    valoresLm35TemperaturaFreezer5,
    valoresChave,
    valoresChaveFreezer2,
    valoresChaveFreezer3,
    valoresChaveFreezer4,
    valoresChaveFreezer5
) => {
    const app = express();
    app.use((request, response, next) => {
        response.header('Access-Control-Allow-Origin', '*');
        response.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
        next();
    });
    app.listen(SERVIDOR_PORTA, () => {
        console.log(`API executada com sucesso na porta ${SERVIDOR_PORTA}`);
    });
    app.get('/sensores/freezer/1/lm35/temperatura', (_, response) => {
        return response.json(valoresLm35Temperatura);
    });
    app.get('/sensores/freezer/2/lm35/temperatura', (_, response) => {
        return response.json(valoresLm35TemperaturaFreezer2);
    });
    app.get('/sensores/freezer/3/lm35/temperatura', (_, response) => {
        return response.json(valoresLm35TemperaturaFreezer3);
    });
    app.get('/sensores/freezer/4/lm35/temperatura', (_, response) => {
        return response.json(valoresLm35TemperaturaFreezer4);
    });
    app.get('/sensores/freezer/5/lm35/temperatura', (_, response) => {
        return response.json(valoresLm35TemperaturaFreezer5);
    });
    app.get('/sensores/freezer/1/chave', (_, response) => {
        return response.json(valoresChave);
    });
    app.get('/sensores/freezer/2/chave', (_, response) => {
        return response.json(valoresChaveFreezer2);
    });
    app.get('/sensores/freezer/3/chave', (_, response) => {
        return response.json(valoresChaveFreezer3);
    });
    app.get('/sensores/freezer/4/chave', (_, response) => {
        return response.json(valoresChaveFreezer4);
    });
    app.get('/sensores/freezer/5/chave', (_, response) => {
        return response.json(valoresChaveFreezer5);
    });
}

(async () => {
    const valoresLm35Temperatura = [];
    const valoresLm35TemperaturaFreezer2 = [];
    const valoresLm35TemperaturaFreezer3 = [];
    const valoresLm35TemperaturaFreezer4 = [];
    const valoresLm35TemperaturaFreezer5 = [];
    const valoresChave = [];
    const valoresChaveFreezer2 = [];
    const valoresChaveFreezer3 = [];
    const valoresChaveFreezer4 = [];
    const valoresChaveFreezer5 = [];
    await serial(
        valoresLm35Temperatura,
        valoresLm35TemperaturaFreezer2,
        valoresLm35TemperaturaFreezer3,
        valoresLm35TemperaturaFreezer4,
        valoresLm35TemperaturaFreezer5,
        valoresChave,
        valoresChaveFreezer2,
        valoresChaveFreezer3,
        valoresChaveFreezer4,
        valoresChaveFreezer5
    );
    servidor(
        valoresLm35Temperatura,
        valoresLm35TemperaturaFreezer2,
        valoresLm35TemperaturaFreezer3,
        valoresLm35TemperaturaFreezer4,
        valoresLm35TemperaturaFreezer5,
        valoresChave,
        valoresChaveFreezer2,
        valoresChaveFreezer3,
        valoresChaveFreezer4,
        valoresChaveFreezer5
    );
})();
