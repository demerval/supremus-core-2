const CampoNumber = require("../../src/estrutura/campos/CampoNumber");
const CampoString = require("../../src/estrutura/campos/CampoString");
const Model = require("../../src/estrutura/model/Model");

const campos = new Map();
campos.set("id", new CampoNumber({ nome: "codigo", chavePrimaria: { autoIncremento: true } }));
campos.set("nome", new CampoString({ nome: "nome", obrigatorio: true }));
campos.set("telefone", new CampoString({ nome: "tel" }));

const ClienteModel = new Model("cliente", "clientes", campos, 1, false);

module.exports = ClienteModel;
