const Campo = require("./abstract/Campo");

class CampoNumber extends Campo {
  constructor(config) {
    super(config);
    this.tipo = "integer";
  }

  getDados(valor, key) {
    if (valor instanceof Array) {
      return [key, this.nome, valor, this.unico];
    }

    if (valor === undefined || valor === null) {
      if (this.obrigatorio === true) {
        if (this.valorPadrao !== null) {
          return [key, this.nome, this.valorPadrao, this.unico];
        }

        throw new Error(`O valor é obrigatório, campo: ${key}`);
      }

      return [key, this.nome, 'NULL', this.unico];
    }

    if (typeof valor !== 'number') {
      throw new Error(`O campo ${key} tem que ser um número.`);
    }

    if (this.tamanhoMinimo > -1 && valor < this.tamanhoMinimo) {
      throw new Error(`O campo ${key} tem que ser maior que ${this.tamanhoMinimo}.`);
    }

    if (valor > this.tamanhoMaximo) {
      throw new Error(`O campo ${key} tem que ser menor ou igual a ${this.tamanhoMaximo}.`);
    }

    return [key, this.nome, valor, this.unico];
  }

  getValorSql(valor) {
    if (valor === undefined || valor === null) {
      return 'NULL';
    }

    return valor;
  }
}

module.exports = CampoNumber;
