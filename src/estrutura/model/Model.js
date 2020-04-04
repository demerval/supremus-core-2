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
        config.push(campo.getDados(dados[key], key));
      }
    });

    return config;
  }

  getCamposConsulta(key, campos) {
    const camposConsulta = [];

    if (campos === undefined) {
      for (const c of this.campos.values()) {
        camposConsulta.push(`${key}.${c.getNome()}`);
      }
    } else {
      for (const c of campos) {
        const campo = this.getCampo(c);
        if (campo === undefined) {
          throw new Error(`O campo ${c} não foi localizado.`);
        }

        camposConsulta.push(`${key}.${campo.getNome()}`);
      }
    }

    return camposConsulta;
  }

  async onEstruturaVerificada() { }
}

module.exports = Model;
