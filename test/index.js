const path = require("path");
__basedir = path.resolve(__dirname, "../");

const SupremusCore = require('../src/SupremusCore');

const init = async () => {
  SupremusCore.carregarModels(path.join(__basedir, 'test', 'models'));
  return true;
}

const criarUsuarioSuporte = async () => {
  try {
    const usuario = {
      nome: 'suporte',
      senha: '1234',
      dataAlteracao: new Date().getTime(),
    }

    const usuarioPermissao = {
      idUsuario: ['usuario', 'id'],
      permissao: 'admin',
      dataAlteracao: ['usuario', 'dataAlteracao'],
    }

    const config = [
      { id: 'usuario', status: 'insert', dados: usuario },
      { id: 'usuarioPermissao', status: 'insert', dados: usuarioPermissao },
    ]

    const dados = await SupremusCore.modelPersiste(config);
    return dados;
  } catch (error) {
    throw new Error(error.message);
  }
}

const atualizarUsuarioSuporte = async (usuario) => {
  try {
    usuario.senha = '12345678';
    usuario.dataAlteracao = new Date().getTime();

    const config = [
      { id: 'usuario', status: 'update', dados: usuario },
    ]

    const dados = await SupremusCore.modelPersiste(config);
    return dados;
  } catch (error) {
    throw new Error(error.message);
  }
}

const consultarUsuarioSuporte = async () => {
  try {
    const result = await SupremusCore.modelConsultar({
      key: 'u',
      tabela: 'usuario',
      campos: ['id', 'nome', 'dataAlteracao'],
      joins: [{
        key: 'up',
        tabela: 'usuarioPermissao',
        //joinTipo: 'inner', // inner left right padrao inner
        joinOn: ['idUsuario', ['u', 'id']],
        campos: ['id', 'permissao'],
        criterios: [{ campo: 'permissao', valor: 'admin' }],
      }],
      criterios: [{ campo: 'id', valor: [1, 2] }],
      ordem: ['u.nome', 'up.permissao'],
    });

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
}

const consultarUsuarioSuportePorId = async (id) => {
  try {
    const result = await SupremusCore.modelConsultarPorId({
      id,
      tabela: 'usuario',
      campos: ['id', 'nome', 'dataAlteracao'],
    });

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
}

const teste01 = async () => {
  try {
    await init();
    //await criarUsuarioSuporte();
    const usuario = await consultarUsuarioSuportePorId(1);
    await atualizarUsuarioSuporte(usuario);
    const usuarios = await consultarUsuarioSuporte();
    console.log(usuarios);

  } catch (error) {
    console.log(error.message);
  }
}

teste01();