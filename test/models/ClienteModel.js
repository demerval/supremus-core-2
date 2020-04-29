const { CampoNumber, CampoString, CampoBoolean, CampoDate } = require("../../src/estrutura/campos");
const Model = require("../../src/estrutura/model/Model");
const ModelUpdateVersaoUtil = require("../../src/estrutura/model/ModelUpdateVersaoUtil");

const campos = new Map();
campos.set("id", new CampoNumber({ nome: "id", chavePrimaria: { autoIncremento: true } }));
campos.set("razaoSocial", new CampoString({ nome: "razao", obrigatorio: true, unico: true }));
campos.set("nomeFantasia", new CampoString({ nome: "fantasia" }));
campos.set("logradouro", new CampoString({ nome: "logradouro" }));
campos.set("numero", new CampoString({ nome: "numero", tamanhoMaximo: 10 }));
campos.set("complemento", new CampoString({ nome: "complemento", tamanhoMaximo: 30 }));
campos.set("bairro", new CampoString({ nome: "bairro" }));
campos.set("cidade", new CampoString({ nome: "cidade" }));
campos.set("cidadeCod", new CampoNumber({ nome: "cidade_cod" }));
//campos.set("estado", new CampoString({ nome: "estado", tamanhoMaximo: 40 }));
campos.set("estadoSigla", new CampoString({ nome: "estado_sigla", tamanhoMaximo: 2 }));
campos.set("estadoCod", new CampoNumber({ nome: "estado_cod" }));
campos.set("cep", new CampoString({ nome: "cep", tamanhoMinimo: 9, tamanhoMaximo: 9 }));
campos.set("doc1", new CampoString({ nome: "doc1", obrigatorio: true, unico: true, tamanhoMaximo: 20 }));
campos.set("doc2", new CampoString({ nome: "doc2", tamanhoMaximo: 20 }));
campos.set("tel1", new CampoString({ nome: "tel1", obrigatorio: true, tamanhoMaximo: 14 }));
campos.set("tel2", new CampoString({ nome: "tel2", tamanhoMaximo: 14 }));
campos.set("email", new CampoString({ nome: "email", tipoCaracter: 'none' }));
campos.set("contatoNome", new CampoString({ nome: "contato_nome" }));
campos.set("contatoTel", new CampoString({ nome: "contato_tel", tamanhoMaximo: 14 }));
campos.set("contribuinteIPI", new CampoBoolean({ nome: "ipi" }));
campos.set("substitutoTributario", new CampoBoolean({ nome: "st" }));
campos.set("crt", new CampoNumber({ nome: 'crt', obrigatorio: true }, CampoNumber.FieldType().SMALL_INT));
campos.set("simplesAliquota", new CampoNumber({ nome: 'simples_alicota', decimal: 2 }));
campos.set("identificacao", new CampoString({ nome: "identificacao", tamanhoMaximo: 30 }));
campos.set("idContador", new CampoNumber({ nome: 'cod_contador' }));
campos.set("codAtividade", new CampoNumber({ nome: 'cod_ativ' }, CampoNumber.FieldType().SMALL_INT));
campos.set("tipoInfo", new CampoNumber({ nome: 'tipo_info' }, CampoNumber.FieldType().SMALL_INT));
campos.set("codAtivSpedCont", new CampoNumber({ nome: 'cod_ativ_sped_cont' }, CampoNumber.FieldType().SMALL_INT));
campos.set("pis", new CampoBoolean({ nome: "pis" }));
campos.set("cofins", new CampoBoolean({ nome: "cofins" }));
campos.set("idEmpresa", new CampoNumber({ nome: 'cod_empresa', obrigatorio: true }));
campos.set("codSituacao", new CampoNumber({ nome: 'cod_situacao' }, CampoNumber.FieldType().SMALL_INT));
campos.set('dataCadastro', new CampoDate({ nome: 'data_cadastro' }));
campos.set("obs", new CampoString({ nome: "obs" }));

/**
 * idEmpresa:
 * 1 - DSG
 * 2 - Supremus
 * 3 - Lince
 */
class ClienteModel extends Model {

  constructor() {
    super("cliente", "cliente", campos, 2);
  }

  async onEstruturaVerificada(dao) {
    let model = await ModelUpdateVersaoUtil.getModelVersao(dao, 'cliente');

    if (model.versaoUpdate === 0) {
      await dao.executarSql('update cliente set cod_situacao = 1 where cod_situacao is null;');

      model.versaoUpdate = 1;
      ModelUpdateVersaoUtil.atualizarVersao(dao, model);
    }

  }

}

module.exports = new ClienteModel();
