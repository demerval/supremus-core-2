const Campo = require("./abstract/Campo");
const CaseType = require('../../enuns/CaseType');

class CampoString extends Campo {
  constructor(config) {
    super(config);
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

    if (typeof valor !== 'string') {
      throw new Error(`O campo ${key} tem que ser uma string.`);
    }

    if (this.tamanhoMinimo > 0 && this.tamanhoMinimo > valor.length) {
      throw new Error(`O campo ${key} tem que ter no mínimo ${this.tamanhoMinimo} caracteres.`);
    }

    if (valor.length > this.tamanhoMaximo) {
      throw new Error(`O campo ${key} tem que ter no máximo ${this.tamanhoMaximo} caracteres.`);
    }

    switch (this.getTipoCaracter()) {
      case CaseType.NONE:
        return [key, this.nome, valor, this.unico];
      case CaseType.LOWER:
        return [key, this.nome, valor.toLowerCase(), this.unico];
      default:
        return [key, this.nome, valor.toUpperCase(), this.unico];
    }
  }

  getValorSql(valor) {
    if (valor === undefined || valor === null) {
      return 'NULL';
    }

    return `'${valor}'`;
  }
}

module.exports = CampoString;
