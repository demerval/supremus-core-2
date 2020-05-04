const Campo = require("./abstract/Campo");
const CaseType = require('../../enuns/CaseType');
const md5 = require('js-md5');

class CampoString extends Campo {
  constructor(nome, config, password) {
    super(nome, config);
    this.password = password || false;
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
        return [key, this.nome, this.password === true ? md5.base64(valor) : valor, this.unico, this.isChavePrimaria()];
      case CaseType.LOWER:
        return [key, this.nome, this.password === true ? md5.base64(valor.toLowerCase()) : valor.toLowerCase(), this.unico, this.isChavePrimaria()];
      default:
        return [key, this.nome, this.password === true ? md5.base64(valor.toUpperCase()) : valor.toUpperCase(), this.unico, this.isChavePrimaria()];
    }
  }

  getValorSql(valor) {
    if (valor === undefined || valor === null) {
      return 'NULL';
    }

    if (this.password === true) {
      return `'${md5.base64(valor)}'`;
    }

    return `'${valor}'`;
  }
}

module.exports = CampoString;
