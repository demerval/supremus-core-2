module.exports = {

  async validarInsertUpdate(dao, nomeTabela, chavePrimaria, dados, status) {
    let campos = [];
    let valores = [];

    for (let values of dados) {
      if (values[3] === true) {
        campos.push(`${values[1]} = ? `);
        valores.push(values[2]);
      }
    }

    if (campos.length === 0) {
      return true;
    }

    let chave = chavePrimaria[1].nome;
    let sql = `SELECT ${chave} FROM ${nomeTabela} WHERE (${campos.join(' OR ')})`;
    if (status === 'update') {
      sql += ` AND ${chave} <> ?`;
      valores.push(getValorChavePrimaria(chave[0], dados)[2]);
    }

    let rows = await dao.executarSql(sql, valores);
    if (rows.length) {
      throw Error(`O registro já existe na base de dados!`);
    }

    return true;
  },

}

function getValorChavePrimaria(key, dados) {
  return dados.find(d => d[0] === key);
}