const ModelManager = require("../estrutura/model/ModelManager");
const SqlConsultaUtil = require("./SqlConsultaUtil");

class SqlConsulta {
  constructor() {
    this.sqlUtil = new SqlConsultaUtil();
  }

  getSql(config) {
    if (config instanceof Array) {
      return "";
    }

    const dados = this.getDados(config);
    let sql = `SELECT ${dados.campos.join(", ")} FROM ${dados.tabela}`;
    if (dados.criterio) {
      sql += ` WHERE ${dados.criterio}`;
    }
    if (dados.ordem) {
      sql += ` ORDER BY ${dados.ordem}`;
    }

    return sql.toUpperCase();
  }

  getDados(config) {
    const model = ModelManager.getModel(config.tabela);
    if (model === undefined) {
      throw new Error(`O model ${config.tabela} não foi localizado.`);
    }

    const campos = model.getCamposConsulta(config.key, config.campos);
    const criterio = this.sqlUtil.getCriterio(
      config.key,
      model,
      config.criterios
    );
    const ordem = this.sqlUtil.getDadosOrdem(config.key, model, config.ordem);

    return {
      tabela: `${model.getNomeTabela()} AS ${config.key}`,
      campos,
      criterio,
      ordem
    };
  }
}

module.exports = SqlConsulta;
