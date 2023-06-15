var empresaModel = require('../models/empresaModel');

function cadastrar(req, res){
    var empresa = req.body.empresa;
    empresaModel.cadastrar(empresa);
    console.log("Deu certo!");
}

module.exports = {
    cadastrar
}