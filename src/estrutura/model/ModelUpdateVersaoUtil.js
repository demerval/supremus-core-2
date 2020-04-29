const SupremusCore = require('../../SupremusCore');

module.exports = {

  async getModelVersao(dao, id) {
    let model = await SupremusCore.modelConsultarPorId({ tabela: 'updateVersao', id }, dao);
    if (model === undefined) {
      model = { id, versaoUpdate: 0 };
      const config = [
        { id: 'updateVersao', status: 'insert', dados: model },
      ]

      await SupremusCore.modelPersiste(config, dao);
    }

    return model;
  },

  async atualizarVersao(dao, model) {
    const config = [
      { id: 'updateVersao', status: 'update', dados: model },
    ]

    await SupremusCore.modelPersiste(config, dao);

    return true;
  },

}