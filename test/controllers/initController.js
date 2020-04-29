const { Cryptografia } = require('../../index_2');
const express = require('express');
const Util = require('../utils/utils');

const router = express.Router();

router.post('/verificar', async (_req, res) => {
  try {
    const senha = Util.gerarSenha();
    let rSenha = senha.substring(0, 10) + Util.gerarSenha(15) + senha.substring(10, 50) + Util.gerarSenha(15) + senha.substring(50, 65) + Util.gerarSenha(5);

    return res.send(Cryptografia.encrypt({ a: false, b: rSenha }));
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = app => app.use('/api/init', router);
