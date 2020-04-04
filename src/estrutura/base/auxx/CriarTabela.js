const ChavePrimariaUtil = require('./ChavePrimariaUtil');
const GeradorUtil = require('./GeradorUtil');
const TabelaUtil = require('./TabelaUtil');

module.exports = {

  async criar(dao, config) {
    await dao.executarSql(config.tabela.sql);

    if (config.configChavePrimaria) {
      await ChavePrimariaUtil.criarChavePrimaria(dao, config.configChavePrimaria);
    }
    if (config.configGerador) {
      await GeradorUtil.criarGerador(dao, config.configGerador);
    }

    return await TabelaUtil.atualizarVersaoTabela(dao, config);
  },
  
}