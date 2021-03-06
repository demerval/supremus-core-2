const DAO = require('../../db/DAO');
const ModelManager = require('./ModelManager');
const ModelInsert = require('./auxx/ModelInsert');
const ModelUpdate = require('./auxx/ModelUpdate');
const ModelDelete = require('./auxx/ModelDelete');
const Status = require('../../enuns/Status');
const Consulta = require('../../sql/Consulta');

class ModelPersiste {

  async persistir(config, dao) {
    let openDao = (dao === undefined);

    try {
      if (openDao === true) {
        dao = new DAO();
        await dao.openConexao(true);
      }

      let result = {};

      for (let c of config.persistir) {
        const model = ModelManager.getModel(c.id);
        const dados = model.getDados(c.dados);

        for (let d of dados) {
          if (d[2] instanceof Array) {
            const c = d[2];
            d[2] = result[c[0]][c[1]];
          }
        }

        switch (c.status) {
          case Status.INSERT:
            const itemInsert = await ModelInsert.persiste(dao, model, dados);
            result[c.id] = itemInsert;
            break;
          case Status.UPDATE:
            const itemUpdate = await ModelUpdate.persiste(dao, model, dados);
            result[c.id] = itemUpdate;
            break;
          case Status.DELETE:
            const itemDelete = await ModelDelete.persiste(dao, model, dados);
            result[c.id] = itemDelete;
            break;
          default:
            throw new Error('Status inválido.');
        }

      }

      if (config.consultar) {
        for (let configConsulta of config.consultar) {
          const idConsulta = configConsulta.idConsulta;
          if (idConsulta) {
            if (configConsulta.criterios === undefined) {
              configConsulta.criterios = [];
            }
            configConsulta.criterios.push({ campo: idConsulta.campo, valor: result[idConsulta.campoResult[0]][idConsulta.campoResult[1]] });
          }

          result[configConsulta.key] = await new Consulta().consultar(configConsulta, dao);
        }
      }

      if (openDao === true) {
        await dao.confirmarTransacao();
      }

      return result;
    } catch (error) {
      throw new Error(error);
    } finally {
      if (openDao === true) {
        if (dao.isConexaoOpen()) {
          dao.closeConexao();
        }
      }
    }
  }

}

module.exports = ModelPersiste;