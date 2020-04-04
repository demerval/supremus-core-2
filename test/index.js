const path = require("path");
__basedir = path.resolve(__dirname, "../");

const SupremusCore = require('../src/SupremusCore');

const init = () => {
  return new Promise((resolve, reject) => {
    SupremusCore
      .carregarModels(path.join(__basedir, 'test', 'models'))
      .then(() => resolve())
      .catch(error => reject(error));
  });
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
      //{ id: 'usuarioPermissao', status: 'insert', dados: usuarioPermissao },
    ]

    const dados = await SupremusCore.modelPersiste(config);
    console.log(dados);

  } catch (error) {
    throw new Error(error.message);
  }
}

const teste01 = async () => {
  try {
    await init();
    await criarUsuarioSuporte();

    /*const sql = new SqlConsulta();
    const s = sql.getSql({
      key: "c",
      tabela: "cliente",
      campos: ["id", "nome"],
      criterios: [
        {
          criterio: [
            { campo: "id", valor: 0, operador: ">=", comparador: "or" },
            { campo: "id", valor: 10, operador: "<=" }
          ]
        },
        { criterio: { campo: "nome", valor: "demerval", operador: "like" } },
        { criterio: { campo: "id", valor: [0, 10] } }
      ],
      ordem: ["id"]
    });
  
    const s = sql.getSql({
      key: "c",
      tabela: "cliente",
      criterios: [{ criterio: { campo: "id", valor: 10 } }],
      ordem: ["id", "nome desc"]
    });
  
    console.log(s);*/
  } catch (error) {
    console.log(error.message);
  }
}

teste01();