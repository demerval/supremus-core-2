const ModelManager = require("./estrutura/model/ModelManager");
const CarregarModelsUtil = require("./estrutura/base/auxx/CarregarModelsUtil");
const EstruturaVerificar = require("./estrutura/base/EstruturaVerificar");
const Consulta = require('./sql/Consulta');

const ModelPersiste = require('./estrutura/model/ModelPersiste');

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
    return ModelManager.getModel(nome.toLowerCase());
  },

  async modelPersiste(config, dao) {
    try {
      const result = await new ModelPersiste().persistir(config, dao);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  },

  async modelConsultar(config, dao) {
    try {
      return await new Consulta().consultar(config, dao);
    } catch (error) {
      throw new Error(error);
    }
  },

  async modelConsultarPorId(config, dao) {
    try {
      return await new Consulta().consultarPorId(config, dao);
    } catch (error) {
      throw new Error(error);
    }
  },

  async modelConsultaPaginada(config, dao) {
    try {
      return await new Consulta().consultaPaginada(config, dao);
    } catch (error) {
      throw new Error(error);
    }
  },

}
