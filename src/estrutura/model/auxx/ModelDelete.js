const ModelConverter = require('./ModelConverter');
const Status = require('../../../enuns/Status');

module.exports = {

  async persiste(dao, model, dados) {
    const nomeTabela = model.nomeTabela;

    const valores = [];
    let chave = null;

    dados.forEach(d => {
      if (d[4] === true) {
        chave = d;
      }
    });

    if (chave === null) {
      throw new Error('Não foi informado o id.');
    }
    valores.push(chave[2]);

    await model.onAntesPersistir(dao, dados, Status.DELETE);

    const sql = `DELETE FROM ${nomeTabela} WHERE ${chave[1]} = ?;`;
    await dao.executarSql(sql, valores);

    await model.onDepoisPersistir(dao, dados, Status.DELETE);

    return await ModelConverter.criarModel(dados);
  },

}