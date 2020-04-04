module.exports = {

  async criarGerador(dao, config) {
    const existe = await this._geradorExiste(dao, config.nomeGerador);
    if (existe === true) {
      return;
    }

    return await dao.executarSql(config.sql);
  },

  async _geradorExiste(dao, nomeGerador) {
    let sql = "SELECT RDB$GENERATOR_NAME FROM RDB$GENERATORS "
      + "WHERE RDB$GENERATOR_NAME = ?";

    const rows = await dao.executarSql(sql, [nomeGerador]);
    return rows.length === 1;
  }

}