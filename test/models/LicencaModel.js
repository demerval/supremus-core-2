const { CampoDate, CampoNumber, CampoString, CampoBoolean } = require("../../src/estrutura/campos");
const Model = require("../../src/estrutura/model/Model");
const ModelUpdateVersaoUtil = require("../../src/estrutura/model/ModelUpdateVersaoUtil");

const campos = new Map();
campos.set("id", new CampoNumber({ nome: "id", chavePrimaria: { autoIncremento: true } }));
campos.set("idCliente", new CampoNumber({ nome: "id_cliente", obrigatorio: true }));
campos.set("cnpj", new CampoString({ nome: "cnpj", obrigatorio: true, tamanhoMaximo: 20 }));
campos.set("sistema", new CampoString({ nome: "sistema", obrigatorio: true, tamanhoMaximo: 30 }));
campos.set("versao", new CampoString({ nome: "versao", obrigatorio: true, tamanhoMaximo: 20 }));
campos.set('expiracao', new CampoDate({ nome: 'expiracao' }));
campos.set("ativo", new CampoBoolean({ nome: "ativo" }));

class LicencaModel extends Model {

  constructor() {
    super('licenca', 'licenca', campos, 2);
  }

  async onEstruturaVerificada(dao) {
    let model = await ModelUpdateVersaoUtil.getModelVersao(dao, 'licenca');

    if (model.versaoUpdate === 0) {
      await dao.executarSql('update licenca set ativo = ?;', ['1']);

      model.versaoUpdate = 1;
      ModelUpdateVersaoUtil.atualizarVersao(dao, model);
    }

  }

}

module.exports = new LicencaModel();