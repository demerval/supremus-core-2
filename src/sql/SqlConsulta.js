const ModelManager = require("../estrutura/model/ModelManager");
const SqlConsultaUtil = require("./SqlConsultaUtil");

class SqlConsulta {

  constructor() {
    this.sqlUtil = new SqlConsultaUtil();
    this.configs = new Map();
  }

  getDadosConsulta(config, isPaginado = false) {
    if (config instanceof Array) {
      return "";
    }

    let paginado = isPaginado === true ? `FIRST ${config.qtdeRegistros} SKIP ${config.pagina * config.qtdeRegistros} ` : '';
    const dados = this.getDados(config);
    const campos = dados.campos.map(c => `${c[0]}.${c[1]} AS ${c[2]}`);
    let sql = `SELECT ${paginado}${campos.join(', ')} FROM ${dados.tabela}`;
    if (dados.joins) {
      sql += ` ${dados.joins.join(' ')}`;
    }
    if (dados.criterio) {
      sql += ` WHERE ${dados.criterio}`;
    }
    if (dados.ordem) {
      sql += ` ORDER BY ${dados.ordem}`;
    }

    let sqlTotal = undefined;
    if (isPaginado === true) {
      const model = ModelManager.getModel(config.tabela);
      const campoChave = model.getChavePrimaria();
      sqlTotal = `SELECT COUNT(${config.key}.${campoChave[1].getNome()}) AS TOTAL FROM ${dados.tabela}`;
      if (dados.joins) {
        sqlTotal += ` ${dados.joins.join(' ')}`;
      }
      if (dados.criterio) {
        sqlTotal += ` WHERE ${dados.criterio}`;
      }

      sqlTotal = sqlTotal.toUpperCase();
    }

    return {
      configs: this.configs,
      campos: dados.campos,
      sql: sql.toUpperCase(),
      sqlTotal,
    };
  }

  getDados(config) {
    this.configs.set(config.key, { tabela: config.tabela.toLowerCase(), criterios: config.criterios });

    const model = ModelManager.getModel(config.tabela.toLowerCase());
    const campos = model.getCamposConsulta(config.key, config.campos);

    let joins = undefined;
    if (config.joins) {
      joins = [];
      for (let join of config.joins) {
        this.configs.set(join.key, { tabela: join.tabela.toLowerCase(), criterios: join.criterios });

        const dadosJoin = this.getDadosJoin(join);
        joins.push(dadosJoin.join);
        campos.push(...dadosJoin.campos);
      }
    }

    const criterio = this.sqlUtil.getCriterio(this.configs);

    const ordem = this.sqlUtil.getDadosOrdem(this.configs, config.ordem);

    return {
      tabela: `${model.getNomeTabela()} AS ${config.key}`,
      campos,
      joins,
      criterio,
      ordem
    };
  }

  getDadosJoin(config) {
    const model = ModelManager.getModel(config.tabela.toLowerCase());
    const campos = model.getCamposConsulta(config.key, config.campos);
    const joinTipo = config.joinTipo || 'inner';
    const campo1 = `${config.key}.${model.getCampo(config.joinOn[0]).getNome()}`;
    const campo2 = this._getCampoJoin(config.joinOn[1]);

    return {
      join: `${joinTipo} join ${model.getNomeTabela()} AS ${config.key} on ${campo1} = ${campo2}`,
      campos,
    };
  }

  _getCampoJoin(campo) {
    const nomeModel = this.configs.get(campo[0]).tabela;
    const model = ModelManager.getModel(nomeModel);

    const nomeCampo = campo[1];
    const campoModel = model.getCampo(nomeCampo);
    if (campoModel === undefined) {
      throw new Error(`O campo ${nomeCampo} não foi localizado.`);
    }

    return `${campo[0]}.${campoModel.getNome()}`;
  }

}

module.exports = SqlConsulta;
