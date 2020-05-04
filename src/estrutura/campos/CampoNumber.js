const Campo = require("./abstract/Campo");

class CampoNumber extends Campo {

  constructor(nome, config) {
    this.tamanhoMaximo = -1;
    let tipo = Campo.FieldType().INTEGER;

    if (config) {
      if (config.decimal) {
        tipo = config.decimal > 0 ? Campo.FieldType().DECIMAL : tipo;
      }
      if (config.tipo) {
        tipo = config.tipo;
      }
      if (config.tamanhoMaximo) {
        this.tamanhoMaximo = config.tamanhoMaximo;
      }
    }

    this.configure(nome, tipo, config);
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

    if (typeof valor === 'string') {
      valor = valor.replace('.', '');
      if (this.tipo === Campo.FieldType().DECIMAL) {
        valor = valor.replace(',', '.');
        return valor;
      }

      return valor;
    }

    return valor;
  }
}

module.exports = CampoNumber;
