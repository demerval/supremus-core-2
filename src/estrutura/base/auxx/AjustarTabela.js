const TabelaUtil = require('./TabelaUtil');
const CriarTabela = require('./CriarTabela');

module.exports = {

  async verificarTabela(dao, config) {
    const nomeTabela = config.nomeTabela;
    const sql = "SELECT VERSAO FROM ESTRUTURA_VERSAO WHERE TABELA = ?";

    let rows = await dao.executarSql(sql, [nomeTabela]);
    if (rows.length === 0) {
      const existe = await TabelaUtil.tabelaExiste(dao, nomeTabela);
      if (existe === false) {
        return await CriarTabela.criar(dao, config);
      }

      await this._ajustarTabela(dao, config);
      return await TabelaUtil.atualizarVersaoTabela(dao, config);
    }

    if (config.versao <= rows[0].VERSAO) {
      return true;
    }

    await this._ajustarTabela(config);
    return await TabelaUtil.atualizarVersaoTabela(dao, config);
  },

  async _ajustarTabela(dao, config) {
    const campos = config.getCampos();
    for (let campo of campos) {
      if (campo.getTipo() !== 'varchar') {
        continue;
      }
      await this._ajustarCampo(dao, config.getNomeTabela(), campo);
    }

    return true;
  },

  async _ajustarCampo(dao, nomeTabela, campo) {
    const ajustar = await this._verificarTamanhoCampo(dao, nomeTabela, campo);
    if (ajustar === true) {
      let sql = "ALTER TABLE "
        + nomeTabela
        + " ALTER "
        + campo.getNome()
        + " TYPE VARCHAR("
        + campo.getTamanhoMaximo()
        + ");";

      await dao.executarSql(sql);
    }

    return true;
  },

  async _verificarTamanhoCampo(dao, nomeTabela, campo) {
    const sql = "SELECT RDB$RELATION_FIELDS.RDB$FIELD_NAME FIELD_NAME, "
      + "RDB$FIELDS.RDB$FIELD_LENGTH FIELD_SIZE "
      + "FROM RDB$RELATION_FIELDS "
      + "JOIN RDB$FIELDS "
      + "ON RDB$FIELDS.RDB$FIELD_NAME = "
      + "RDB$RELATION_FIELDS.RDB$FIELD_SOURCE "
      + "JOIN RDB$TYPES "
      + "ON RDB$FIELDS.RDB$FIELD_TYPE = RDB$TYPES.RDB$TYPE AND "
      + "RDB$TYPES.RDB$FIELD_NAME = 'RDB$FIELD_TYPE' "
      + "WHERE RDB$RELATION_FIELDS.RDB$RELATION_NAME = '" + nomeTabela + "'"
      + "AND RDB$RELATION_FIELDS.RDB$FIELD_NAME = '" + campo.getNome() + "';";

    const rows = await dao.executarSql(sql);
    if (rows.length === 0) {
      return false;
    }

    return campo.getTamanhoMaximo() > rows[0].FIELD_SIZE;
  }

}