const Campo = require("./abstract/Campo");

class CampoNumber extends Campo {

  constructor(config, tipo = Campo.FieldType().INTEGER) {
    super(config, config.decimal ? (config.decimal > 0 ? Campo.FieldType().DECIMAL : tipo) : tipo);
    if (config.tamanhoMaximo === undefined) {
      this.tamanhoMaximo = -1;
    }
  }

  getDados(valor, key) {
    if (valor instanceof Array) {
      return [key, this.nome, valor, this.unico, this.isChavePrimaria()];
    }

    if (valor === undefined || valor === null) {
      if (this.obrigatorio === true) {
        if (this.valorPadrao !== null) {
          return [key, this.nome, this.valorPadrao, this.unico, this.isChavePrimaria()];
        }

        throw new Error(`O valor é obrigatório, campo: ${key}`);
      }

      return [key, this.nome, null, this.unico, this.isChavePrimaria()];
    }

    if (typeof valor !== 'number') {
      throw new Error(`O campo ${key} tem que ser um número.`);
    }

    if (this.tamanhoMinimo > -1 && valor < this.tamanhoMinimo) {
      throw new Error(`O campo ${key} tem que ser maior que ${this.tamanhoMinimo}.`);
    }

    if (this.tamanhoMaximo > -1 && valor > this.tamanhoMaximo) {
      throw new Error(`O campo ${key} tem que ser menor ou igual a ${this.tamanhoMaximo}.`);
    }

    return [key, this.nome, valor, this.unico, this.isChavePrimaria()];
  }

  getValorSql(valor) {
    if (valor === undefined || valor === null) {
      return 'NULL';
    }

    return valor;
  }
}

module.exports = CampoNumber;
