const DAO = require('../db/DAO');
const SqlConsulta = require('./SqlConsulta');
const ModelConverter = require('../estrutura/model/auxx/ModelConverter');
const ModelManager = require('../estrutura/model/ModelManager');

class Consulta {

  async consultar(config, dao) {
    let openDao = (dao === undefined);

    try {
      if (openDao === true) {
        dao = new DAO();
        await dao.openConexao();
      }

      if (config instanceof Array) {
        let rowsResult = {};

        for (let c of config) {
          const dados = new SqlConsulta().getDadosConsulta(c);
          const rows = await dao.executarSql(dados.sql);

          rowsResult[c.key] = rows;
        }

        return await ModelConverter.criarModelConsulta(dados.configs, dados.campos, rowsResult);
      }

      const dados = new SqlConsulta().getDadosConsulta(config);
      const rows = await dao.executarSql(dados.sql);

      return await ModelConverter.criarModelConsulta(dados.configs, dados.campos, rows);
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

  async consultarPorId(config, dao) {
    let openDao = (dao === undefined);

    try {
      if (openDao === true) {
        dao = new DAO();
        await dao.openConexao();
      }

      const model = ModelManager.getModel(config.tabela);
      const chaveCampo = model.getChavePrimaria();

      config.key = 'a';
      config.criterios = [{ campo: chaveCampo[0], valor: config.id }];

      const dados = new SqlConsulta().getDadosConsulta(config);
      const rows = await dao.executarSql(dados.sql);

      if (rows.length > 0) {
        const result = await ModelConverter.criarModelConsulta(dados.configs, dados.campos, rows);
        return result[0];
      }

      return;
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

  async consultaPaginada(config, dao) {
    let openDao = (dao === undefined);

    try {
      if (openDao === true) {
        dao = new DAO();
        await dao.openConexao();
      }

      let totalReg = 0;
      const dados = new SqlConsulta().getDadosConsulta(config, true);
      const rows = await dao.executarSql(dados.sql);
      if (rows.length > 0) {
        let rowsT = await dao.executarSql(dados.sqlTotal);
        totalReg = parseInt(rowsT[0].TOTAL, 0);
      }

      const data = await ModelConverter.criarModelConsulta(dados.configs, dados.campos, rows);
      return { totalReg, data };
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

module.exports = Consulta;