const { CampoDate, CampoNumber, CampoString } = require("../../src/estrutura/campos");
const Model = require("../../src/estrutura/model/Model");

const campos = new Map();
campos.set("id", new CampoNumber({ nome: "codigo", chavePrimaria: { autoIncremento: true } }));
campos.set("idUsuario", new CampoNumber({
  nome: "cod_usuario",
  chaveEstrangeira: {
    nomeTabela: 'usuarios',
    nomeCampo: 'codigo',
    onUpdate: 'CASCADE', // Caso seja omitido o padrão é RESTRICT.
    onDelete: 'CASCADE', // Caso seja omitido o padrão é RESTRICT.
  }
}));
campos.set("permissao", new CampoString({ nome: "permissao", obrigatorio: true }));
campos.set('dataAlteracao', new CampoDate({ nome: 'dt_alteracao' }, true));


const UsuarioPermissaoModel = new Model("usuarioPermissao", "usuarios_permissao", campos, 1, false);

module.exports = UsuarioPermissaoModel;