class Campo {

  constructor(config) {
    this.nome = config.nome.toUpperCase();
    this.tipo = config.tipo || "varchar";
    this.chavePrimaria = config.chavePrimaria;
    this.chaveEstrangeira = config.chaveEstrangeira;
    this.tipoCaracter = config.tipoCaracter;
    this.decimal = config.decimal;
    this.obrigatorio = config.obrigatorio || false;
    this.unico = config.unico || false;
    this.tamanhoMinimo = config.tamanhoMinimo || -1;
    this.tamanhoMaximo = config.tamanhoMaximo || 60;
    this.valorPadrao = config.valorPadrao || null;
  }

  getNome() {
    return this.nome;
  }

  getTipo() {
    return this.tipo.toUpperCase();
  }

  isChavePrimaria() {
    return this.chavePrimaria !== undefined;
  }

  getChavePrimaria() {
    return this.chavePrimaria;
  }

  isChaveEstrangeira() {
    return this.chaveEstrangeira !== undefined;
  }

  getChaveEstrangeira() {
    return this.chaveEstrangeira;
  }

  getTipoCaracter() {
    return this.tipoCaracter;
  }

  getDecimal() {
    return this.decimal;
  }

  isObrigatorio() {
    return this.obrigatorio;
  }

  isUnico() {
    return this.unico;
  }

  getValorPadrao() {
    return this.valorPadrao;
  }

  getTamanhoMinimo() {
    return this.tamanhoMinimo;
  }

  getTamanhoMaximo() {
    return this.tamanhoMaximo;
  }

  getDados(valor, key) {
    throw new Error("Metodo abstrato implementação obrigatória.");
  }

  getValorSql(valor) {
    throw new Error("Metodo abstrato implementação obrigatória.");
  }
}

module.exports = Campo;
