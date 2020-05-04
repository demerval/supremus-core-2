const { CampoNumber, CampoString } = require('../../campos');
const Model = require('../../model/Model');

const campos = new Map();
campos.set('id', new CampoString({ nome: 'tabela', chavePrimaria: { obrigatorio: true } }));
campos.set('versaoUpdate', new CampoNumber({ nome: 'versao_update', obrigatorio: true }));

const UpdateVersaoModel = new Model('updateVersao', 'update_versao_2', campos, 1);

module.exports = UpdateVersaoModel;