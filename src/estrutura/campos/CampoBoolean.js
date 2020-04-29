const Campo = require("./abstract/Campo");

class CampoBoolean extends Campo {

  constructor(config) {
    super(config, Campo.FieldType().BOOLEAN);
  }

  getDados(valor, key) {
    if (valor instanceof Array) {
      return [key, this.nome, valor, this.unico, this.isChavePrimaria()];
    }

    if (valor === undefined || valor === null) {
      return [key, this.nome, '0', this.unico, this.isChavePrimaria()];
    }

    if (typeof valor !== 'boolean') {
      if (valor === '1' || valor === '0') {
        return [key, this.nome, valor, this.unico, this.isChavePrimaria()];
      }

      throw new Error(`O campo ${key} tem que ser booleano.`);
    }

    return [key, this.nome, valor === true ? '1' : '0', this.unico, this.isChavePrimaria()];
  }

  getValorSql(valor) {
    if (valor === undefined || valor === null) {
      return '0';
    }

    if (valor instanceof Boolean) {
      return valor === true ? '1' : '0';
    }

    if (typeof valor === 'string') {
      if (valor.toLowerCase() === 'true') {
        return '1';
      }
      if (valor.toLowerCase() === 'false') {
        return '0';
      }
      if (valor === '1' || valor === '0') {
        return valor;
      }
    }

    if (valor instanceof Number) {
      if (valor === 1) {
        return '1';
      }
      if (valor === 0) {
        return '0';
      }
    }

    throw new Error(`Erro no valor informado o valor tem que ser booleano. Valor: ${valor}`)
  }
}

module.exports = CampoBoolean;
