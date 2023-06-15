var empresaController = require('../controllers/empresaController');
var express = require('express');
var router = express.Router();

router.post('/cadastrar', (req, res) => {
    empresaController.cadastrar(req, res);
});

module.exports = router;