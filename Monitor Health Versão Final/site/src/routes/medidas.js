var express = require("express");
var router = express.Router();

var medidaController = require("../controllers/medidaController");

router.get("/ultimas/:freezer", function (req, res) {
    medidaController.buscarUltimasMedidas(req, res);
});

router.get("/tempo-real", function (req, res) {
    medidaController.buscarMedidasEmTempoReal(req, res);
})

router.get("/aberturas/:freezer", function (req, res) {
    medidaController.buscarAberturas(req, res);
});

module.exports = router;