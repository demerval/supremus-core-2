const { CampoDate, CampoNumber, CampoString, CampoBoolean } = require("../../src/estrutura/campos");
const Model = require("../../src/estrutura/model/Model");
const ModelUpdateVersaoUtil = require("../../src/estrutura/model/ModelUpdateVersaoUtil");

const campos = new Map();
campos.set("id", new CampoNumber({ nome: "id", chavePrimaria: { autoIncremento: true } }));
campos.set("nome", new CampoString({ nome: "nome", obrigatorio: true, unico: true, tamanhoMaximo: 30 }));
campos.set("senha", new CampoString({ nome: "senha", tipoCaracter: 'none' }, true));
campos.set('permissao', new CampoNumber({ nome: 'permissao', obrigatorio: true, tipoCaracter: 'lower' }));
campos.set("permissaoWeb", new CampoString({ nome: "permissao_web", obrigatorio: true, tamanhoMaximo: 5 }));
campos.set('dataAlteracao', new CampoDate({ nome: 'dt_alteracao' }, true));
campos.set("idEmpresa", new CampoNumber({ nome: 'cod_empresa', obrigatorio: true }));
campos.set("ativo", new CampoBoolean({ nome: "ativo" }));


//const UsuarioModel = new Model("usuario", "usuarios", campos, 1);

// class UsuarioModel extends Model {

//   constructor() {
//     super("usuario", "usuarios", campos, 1)
//   }

//   async onAntesPersistir(dao, item, status) {
//     //console.log('antes');
//     //console.log('item', item);
//     //console.log('status', status);
//   }

//   async onDepoisPersistir(dao, item, status) {
//     //console.log('depois');
//     //console.log('item', item);
//     //console.log('status', status);
//   }

//   async onDadosCarregado(item) {
//     //console.log('carregado');
//     //console.log('item', item);
//     //item.total = 10.0;
//   }

// }

class UsuarioModel extends Model {

  constructor() {
    super('usuario', 'usuario', campos, 2);
  }

  async onEstruturaVerificada(dao) {
    let model = await ModelUpdateVersaoUtil.getModelVersao(dao, 'usuario');

    if (model.versaoUpdate === 0) {
      await dao.executarSql('update usuario set ativo = ?;', ['1']);

      model.versaoUpdate = 1;
      ModelUpdateVersaoUtil.atualizarVersao(dao, model);
    }

  }

}

module.exports = new UsuarioModel();