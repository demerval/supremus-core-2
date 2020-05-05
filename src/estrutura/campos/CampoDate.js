const Campo = require("./abstract/Campo");
const moment = require('moment');

class CampoDate extends Campo {

  constructor(nome, config) {
    super();

    this.dataUpdate = false;
    if (config) {
      this.dataUpdate = config.dataUpdate || false;
    }
    const tipo = this.dataUpdate === true ? Campo.FieldType().BIG_INT : Campo.FieldType().DATE;
    this.configure(nome, tipo, config);
  }

  isDateUpdate() {
    return this.dataUpdate;
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

      if (this.dataUpdate === true) {
        return [key, this.nome, new Date().getTime(), this.unico, this.isChavePrimaria()];
      }

      return [key, this.nome, null, this.unico, this.isChavePrimaria()];
    }

    if (this.dataUpdate === true) {
      if (typeof valor !== "number") {
        throw new Error(`O campo ${key} tem que ser um número.`);
      }

      return [key, this.nome, valor, this.unico, this.isChavePrimaria()];
    }

    if (valor instanceof Date) {
      return [key, this.nome, `${moment(date).format('YYYY-MM-DD')}`, this.unico, this.isChavePrimaria()];
    }

    if (moment(valor, 'DD/MM/YYYY', true).isValid() === false) {
      throw new Error(`A data do campo ${key} não é válida: ${valor}`);
    }

    return [key, this.nome, `${moment(valor, 'DD/MM/YYYY').format('YYYY-MM-DD')}`, this.unico, this.isChavePrimaria()];
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

    return `'${moment(valor, 'DD/MM/YYYY').format('YYYY-MM-DD')}'`;
  }
}

module.exports = CampoDate;
