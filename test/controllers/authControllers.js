const { SupremusCore, CryptoMiddleware, Cryptografia } = require('../../index_2');
const jwt = require('jsonwebtoken');
const md5 = require('js-md5');

const Util = require('../utils/utils');
const AuthConfig = require(__basedir + '/config/auth');

const express = require('express');
const router = express.Router();
router.use(CryptoMiddleware);

router.post('/login', async (req, res) => {
  try {
    const { login, c } = req.body;
    const { userName, password } = Cryptografia.decrypt(login, c);

    const usuarios = await SupremusCore.modelConsultar({
      key: 'u',
      tabela: 'usuario',
      criterios: [
        { campo: 'nome', valor: userName },
      ]
    });

    if (usuarios.length === 0) {
      return res.status(400).send({ error: 'Usuário não localizado!' });
    }

    const usuario = usuarios[0];
    if (md5.base64(password) !== usuario.senha) {
      return res.status(400).send({ error: 'Senha Inválida!' });
    }

    usuario.uuid = Util.gerarSenha();
    const token = jwt.sign(usuario, AuthConfig.secret, {
      expiresIn: AuthConfig.expiresIn
    });

    return res.send(Cryptografia.encrypt({
      status: 'ok',
      currentAuthority: usuario.permissaoWeb,
      systemAuthority: usuario.permissao,
      companyId: usuario.idEmpresa,
      token: token,
      uuid: usuario.uuid,
      userId: usuario.id,
      userName: usuario.nome,
    }));
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = app => app.use('/api/auth', router);
