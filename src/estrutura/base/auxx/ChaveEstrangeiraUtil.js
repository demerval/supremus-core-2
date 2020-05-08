module.exports = {

  async criar(dao, chavesEstrangeiras) {
    for (let config of chavesEstrangeiras) {
      const existe = await this._verificarChaveEstrangeiraExiste(dao, config.nomeTabela, config.nomeCampoFk);
      if (existe === true) {
        continue;
      }

      const indice = await this._indiceChaveEstrangeira(dao, config.nomeTabela);
      const nomeFk = `FK_${config.nomeTabela}_${indice}`;
      const onUpdate = config.onUpdate ? config.onUpdate.toUpperCase() : 'NO ACTION';
      const onDelete = config.onDelete ? config.onDelete.toUpperCase() : 'NO ACTION';

      const sql = "alter table " + config.nomeTabela + " "
        + "add constraint " + nomeFk + " "
        + "foreign key (" + config.nomeCampoFk + ") "
        + "references " + config.nomeTabelaFk + " (" + config.nomeCampoTabelaFk + ") "
        + "on update " + onUpdate + " "
        + "on delete " + onDelete;

      await dao.executarSql(sql);
    }


    return true;
  },

  async _verificarChaveEstrangeiraExiste(dao, nomeTabela, campo) {
    const sql = "SELECT RDB$FIELD_NAME FROM RDB$RELATION_CONSTRAINTS C, RDB$INDEX_SEGMENTS S "
      + "WHERE C.RDB$CONSTRAINT_TYPE = 'FOREIGN KEY' "
      + "AND S.RDB$INDEX_NAME = C.RDB$INDEX_NAME "
      + "AND RDB$RELATION_NAME = ? "
      + "AND RDB$FIELD_NAME = ?";

    const result = await dao.executarSql(sql, [nomeTabela, campo.toUpperCase()]);
    return (result.length === 1);
  },

  async _indiceChaveEstrangeira(dao, nomeTabela) {
    const sql = "SELECT r.RDB$CONSTRAINT_NAME AS NOME, r.RDB$INDEX_NAME AS INDEX_NAME "
      + "FROM RDB$RELATION_CONSTRAINTS r "
      + "WHERE RDB$RELATION_NAME = ? "
      + "AND RDB$CONSTRAINT_TYPE = 'FOREIGN KEY'";

    let indice = 0;
    const valores = [];
    const rows = await dao.executarSql(sql, [nomeTabela]);

    for (let row of rows) {
      let s = row.INDEX_NAME.split('_');
      valores.push(parseInt(s[s.length - 1]));
    }

    if (valores.length > 0) {
      valores.sort((a, b) => a - b);
      indice = (valores[valores.length - 1] + 1);
    }

    return indice;
  },

}