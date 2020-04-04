const ModelUtil = require('./ModelUtil');
const DbConfig = require(__basedir + '/config/dbConfig');

const configDb = DbConfig.app;
const replicar = configDb.replicar !== undefined ? configDb.replicar : false;
const codReplicar = configDb.codReplicar !== undefined ? configDb.codReplicar : '001';

module.exports = {

  async persiste(dao, model, dados) {
    const nomeTabela = model.nomeTabela;
    const campoChave = model.getChavePrimaria();

    ModelUtil.validarInsertUpdate(dao, campoChave, nomeTabela, dados, 'insert');

    if (campoChave[1].chavePrimaria.autoIncremento) {
      const id = await gerarId(dao, nomeTabela, campoChave);
      dados.unshift(id);
    }

    const campos = [];
    const valores = [];
    const params = [];

    dados.forEach(d => {
      campos.push(d[1]);
      valores.push(d[2]);
      params.push('?');
    });

    const sql = `INSERT INTO ${nomeTabela} (${campos.join(', ')}) VALUES (${params.join(', ')});`;
    console.log(sql)
    console.log(valores)
    const result = await dao.executarSql(sql, valores);
    console.log(result);
  },

}

async function gerarId(dao, nomeTabela, campoChave) {
  const key = campoChave[0];
  const campo = campoChave[1];

  const nomeGerador = campo.chavePrimaria.nomeGerador || `${nomeTabela}_GEN`;
  let id = await dao.gerarId(nomeGerador);
  if (replicar && campo.naoReplicar === undefined) {
    id = id + codReplicar;
  }

  return campo.getDados(id, key);
}