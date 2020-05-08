class Model {

  constructor(nome, nomeTabela, campos, versao = 1, verificar = true) {
    this.nome = nome.toLowerCase();
    this.nomeTabela = nomeTabela.toUpperCase();
    this.campos = campos;
    this.versao = versao;
    this.verificar = verificar;
  }

  isVerificar() {
    return this.verificar;
  }

  getNome() {
    return this.nome;
  }

  getNomeTabela() {
    return this.nomeTabela;
  }

  getCampos() {
    return this.campos;
  }

  getCampo(nome) {
    return this.campos.get(nome);
  }

  getVersao() {
    return this.versao;
  }

  getChavePrimaria() {
    for (let [key, value] of this.campos) {
      if (value.isChavePrimaria()) {
        return [key, value];
      }
    }

    throw new Error('Chave primaria não localizada.');
  }

  getDados(dados) {
    const config = [];

    Object.getOwnPropertyNames(dados).forEach(key => {
      const campo = this.campos.get(key);
      if (campo !== undefined) {
        const c = campo.getDados(dados[key], key);
        c.push(campo.tipo);
        config.push(c);
      }
    });

    return config;
  }

  getCamposConsulta(key, campos) {
    const camposConsulta = [];

    if (campos === undefined) {
      for (const [k, c] of this.campos) {
        camposConsulta.push([key, c.getNome(), `${key}_${c.getNome()}`, k, c.tipo]);
      }
    } else {
      for (const c of campos) {
        const campo = this.getCampo(c);
        if (campo === undefined) {
          throw new Error(`O campo ${c} não foi localizado.`);
        }

        camposConsulta.push([key, campo.getNome(), `${key}_${campo.getNome()}`, c, campo.tipo]);
      }
    }

    return camposConsulta;
  }

  async onEstruturaVerificada(dao) { }

  async onDadosCarregado(item) { }

  async onAntesPersistir(dao, item, status) { }

  async onDepoisPersistir(dao, item, status) { }

}

module.exports = Model;
