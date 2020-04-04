const ModelManager = require("./estrutura/model/ModelManager");
const CarregarModelsUtil = require("./estrutura/base/auxx/CarregarModelsUtil");
const EstruturaVerificar = require("./estrutura/base/EstruturaVerificar");

const DAO = require('./db/DAO');
const Status = require('./enuns/Status');

const ModelInsert = require('./estrutura/model/auxx/ModelInsert');

module.exports = {

  async carregarModels(dirModels) {
    await new CarregarModelsUtil().verificarPastas(dirModels);
    await new EstruturaVerificar().verificar();

    return true;
  },

  addModel(model) {
    ModelManager.addModel(model);
  },

  getModel(nome) {
    const model = ModelManager.getModel(nome.toLowerCase());
    if (model !== undefined) {
      return model;
    }

    throw new Error(`Model não localizado: ${nome}`);
  },

  async modelPersiste(config, dao) {
    let openDao = (dao === undefined);

    try {
      if (openDao === true) {
        dao = new DAO();
        await dao.openConexao(true);
      }

      let dados = {};

      for (let c of config) {
        const model = this.getModel(c.id);
        const teste = model.getDados(c.dados);

        switch (c.status) {
          case Status.INSERT:
            await ModelInsert.persiste(dao, model, teste);
            break;
        }

        console.log(teste);

      }

      if (openDao === true) {
        await dao.confirmarTransacao();
      }

      return dados;
    } catch (error) {
      throw new Error(error.message);
    } finally {
      if (openDao === true) {
        if (dao.isConexaoOpen()) {
          dao.closeConexao();
        }
      }
    }
  },

}
