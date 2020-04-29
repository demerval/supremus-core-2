const models = new Map();

class ModelManager {

  static addModel(model) {
    const modelExiste = models.get(model.getNome());
    if (modelExiste !== undefined) {
      throw new Error(`O model ${model.getNome()} já foi adicionado.`);
    }

    models.set(model.getNome(), model);
  }

  static getModel(nome) {
    const model = models.get(nome.toLowerCase());
    if (model !== undefined) {
      return model;
    }

    throw new Error(`Model não localizado: ${nome}`);
  }

  static getModels() {
    return models.values();
  }
}

module.exports = ModelManager;
