const { SupremusCore, AuthMiddleware, Cryptografia } = require('../../index_2');
const express = require('express');

const router = express.Router();
router.use(AuthMiddleware);

router.post('/consultar', async (req, res) => {
  try {
    const { user } = req;
    const { config } = req.body;

    if (config.pagina !== undefined) {
      const dados = await SupremusCore.modelConsultaPaginada(config);
      return res.send(Cryptografia.encrypt(dados, req.aCtl === true ? user.uuid : undefined));
    }

    if (config.porId !== undefined) {
      const row = await SupremusCore.modelConsultarPorId(config);
      return res.send(Cryptografia.encrypt(row, req.aCtl === true ? user.uuid : undefined));
    }

    const rows = await SupremusCore.modelConsultar(config);
    return res.send(Cryptografia.encrypt(rows, req.aCtl === true ? user.uuid : undefined));
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.post('/persistir', async (req, res) => {
  try {
    const { user } = req;
    const { config } = req.body;

    const result = await SupremusCore.modelPersiste(config);
    return res.send(Cryptografia.encrypt(result, req.aCtl === true ? user.uuid : undefined));
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = app => app.use('/api/model', router);
