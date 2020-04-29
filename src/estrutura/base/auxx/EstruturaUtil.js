class EstruturaUtil {

  prepare(model) {
    let config = {
      nomeTabela: model.getNomeTabela(),
      versao: model.getVersao(),
      campos: model.getCampos(),
      configChaveEstrangeira: [],
      onEstruturaVerificada: model.onEstruturaVerificada,
    }

    this._criarSql(config);

    return config;
  }

  _criarSql(config) {
    let sql = [];
    sql.push("CREATE TABLE ");
    sql.push(config.nomeTabela);
    sql.push(" (");

    const campos = config.campos.values();
    for (let campo of campos) {
      let tipo = campo.getTipo().toUpperCase();

      sql.push(campo.getNome());
      sql.push(' ');
      sql.push(tipo);
      if (tipo === 'VARCHAR') {
        sql.push('(' + campo.getTamanhoMaximo() + ')');
      }
      if (tipo === 'NUMERIC') {
        sql.push('(18, ' + campo.getDecimal() + ')');
      }
      if (tipo === 'BLOB') {
        sql.push(' SUB_TYPE 1 SEGMENT SIZE 80');
      }
      if (campo.isObrigatorio() === true || campo.isChavePrimaria() === true) {
        sql.push(' NOT NULL');
      }
      sql.push(', ');

      if (campo.isChavePrimaria() === true) {
        const chavePrimaria = campo.getChavePrimaria();

        const sqlCriarPrimaryKey = "ALTER TABLE " + config.nomeTabela + " "
          + "ADD CONSTRAINT PK_" + config.nomeTabela + " "
          + "PRIMARY KEY (" + campo.getNome() + ");";

        config.configChavePrimaria = {
          nomeTabela: config.nomeTabela,
          sql: sqlCriarPrimaryKey,
        }

        if (chavePrimaria.autoIncremento) {
          const nomeGerador = chavePrimaria.nomeGerador ? chavePrimaria.nomeGerador : `${config.nomeTabela}_GEN`;
          const sqlCriarGenerator = "CREATE SEQUENCE " + nomeGerador + ";";
          config.configGerador = {
            nomeGerador,
            sql: sqlCriarGenerator,
          }
        }
      }

      if (campo.isChaveEstrangeira() === true) {
        const chaveEstrangeira = campo.getChaveEstrangeira();
        const chave = {
          nomeTabela: config.nomeTabela,
          nomeTabelaFk: chaveEstrangeira.nomeTabela.toUpperCase(),
          nomeCampoFk: campo.getNome(),
          nomeCampoTabelaFk: chaveEstrangeira.nomeCampo.toUpperCase(),
          onUpdate: chaveEstrangeira.onUpdate,
          onDelete: chaveEstrangeira.onDelete,
        }
        config.configChaveEstrangeira.push(chave);
      }
    }

    let s = sql.join('');
    config.tabela = {
      sql: s.substring(0, s.length - 2) + ");",
    }
  }

}

module.exports = EstruturaUtil;
