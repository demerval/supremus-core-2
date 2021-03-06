const { CampoNumber, CampoString } = require('../../campos');
const Model = require('../../model/Model');

const campos = new Map();
campos.set('id', new CampoString('tabela', { chavePrimaria: { obrigatorio: true } }));
campos.set('versao', new CampoNumber('versao', { obrigatorio: true }));

const EstruturaVersaoModel = new Model('estruturaVersao', 'estrutura_versao', campos, 1);

module.exports = EstruturaVersaoModel;