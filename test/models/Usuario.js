const { CampoDate, CampoNumber, CampoString } = require("../../src/estrutura/campos");
const Model = require("../../src/estrutura/model/Model");

const campos = new Map();
campos.set("id", new CampoNumber({ nome: "codigo", chavePrimaria: { autoIncremento: true } }));
campos.set("nome", new CampoString({ nome: "nome", obrigatorio: true, unico: true }));
campos.set("senha", new CampoString({ nome: "senha", tipoCaracter: 'none' }));
campos.set('dataAlteracao', new CampoDate({ nome: 'dt_alteracao', dataUpdate: true }));


const UsuarioModel = new Model("usuario", "usuarios", campos, 1);

module.exports = UsuarioModel;