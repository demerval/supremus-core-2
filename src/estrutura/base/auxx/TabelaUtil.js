module.exports = {

  async tabelaExiste(dao, nomeTabela) {
    const sql = "SELECT RDB$RELATION_NAME FROM RDB$RELATIONS WHERE RDB$RELATION_NAME = ?";

    const rows = await dao.executarSql(sql, [nomeTabela]);
    return rows.length === 1;
  },

  async atualizarVersaoTabela(dao, config) {
    let sql = "UPDATE OR INSERT INTO ESTRUTURA_VERSAO "
      + "(TABELA, VERSAO) "
      + "VALUES (?, ?) "
      + "MATCHING (TABELA);";

    const ok = await dao.executarSql(sql, [config.nomeTabela, config.versao]);
    await config.onEstruturaVerificada(dao);

    return ok;
  },

}