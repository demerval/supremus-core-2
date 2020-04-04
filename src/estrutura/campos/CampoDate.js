const Campo = require("./abstract/Campo");
const moment = require('moment');

class CampoDate extends Campo {

  constructor(config) {
    super(config);
    this.dataUpdate = config.dataUpdate || false;
    this.tipo = this.dataUpdate === true ? 'BIGINT' : 'DATE';
  }

  isDateUpdate() {
    return this.dataUpdate;
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

      if (this.dataUpdate === true) {
        return [key, this.nome, new Date().getTime(), this.unico];
      }

      return [key, this.nome, 'NULL', this.unico];
    }

    if (this.dataUpdate === true) {
      if (typeof valor !== "number") {
        throw new Error(`O campo ${key} tem que ser um número.`);
      }

      return [key, this.nome, valor, this.unico];
    }

    if (valor instanceof Date) {
      return [key, this.nome, `'${moment(date).format('YYYY-MM-DD')}'`, this.unico];
    }

    if (moment(valor, 'DD/MM/YYYY', true).isValid() === false) {
      throw new Error(`A data do campo ${key} não é válida: ${valor}`);
    }

    return [key, this.nome, `'${moment(valor).format('YYYY-MM-DD')}'`, this.unico];
  }

  getValorSql(valor) {
    if (valor === undefined || valor === null) {
      return 'NULL';
    }

    if (this.dataUpdate === true) {
      return valor;
    }

    if (valor instanceof Date) {
      return `'${moment(date).format('YYYY-MM-DD')}'`;
    }

    if (moment(valor, 'DD/MM/YYYY', true).isValid() === false) {
      throw new Error(`A data do campo ${key} não é válida: ${valor}`);
    }

    return `'${moment(valor).format('YYYY-MM-DD')}'`;
  }
}

module.exports = CampoDate;
