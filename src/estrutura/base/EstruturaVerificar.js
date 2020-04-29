const DAO = require("../../db/DAO");
const ModelManager = require("../model/ModelManager");
const EstruturaUtil = require("./auxx/EstruturaUtil");
const TabelaUtil = require('./auxx/TabelaUtil');
const CriarTabela = require('./auxx/CriarTabela');
const AjustarTabela = require('./auxx/AjustarTabela');
const ChaveEstrangeiraUtil = require('./auxx/ChaveEstrangeiraUtil');

class EstruturaVerificar {

  constructor() {
    this.dao = new DAO();
  }

  async verificar() {
    try {
      await this.dao.openConexao();

      await this._verificarTabelasUpdate();

      const models = ModelManager.getModels();
      const chavesEstrangeiras = [];

      for (let model of models) {
        if (model.isVerificar() === false) {
          continue;
        }
        if (model.nome === 'updateVersao') {
          continue;
        }

        const config = new EstruturaUtil().prepare(model);
        if (config.configChaveEstrangeira.length > 0) {
          chavesEstrangeiras.push(...config.configChaveEstrangeira);
        }
        await this._executarVerificacao(config);
      }

      if (chavesEstrangeiras.length > 0) {
        await ChaveEstrangeiraUtil.criar(this.dao, chavesEstrangeiras);
      }
    } catch (error) {
      throw new Error(typeof error === 'string' ? error : error.message);
    } finally {
      if (this.dao.isConexaoOpen()) {
        this.dao.closeConexao();
      }
    }
  }

  async _verificarTabelasUpdate() {
    const configEstruturaVersao = new EstruturaUtil().prepare(require('../base/models/EstruturaVersaoModel'));
    await this._executarVerificacao(configEstruturaVersao);

    const modelUpdateVersao = require('../base/models/UpdateVersaoModel');
    const configUpdateVersao = new EstruturaUtil().prepare(modelUpdateVersao);
    await this._executarVerificacao(configUpdateVersao);

    ModelManager.addModel(modelUpdateVersao);
  }

  async _executarVerificacao(config) {
    const existe = await TabelaUtil.tabelaExiste(this.dao, config.nomeTabela);
    if (existe === true) {
      await AjustarTabela.verificarTabela(this.dao, config);
    } else {
      await CriarTabela.criar(this.dao, config);
    }
  }

}

module.exports = EstruturaVerificar;
