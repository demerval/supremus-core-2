const path = require('path');
__basedir = path.resolve(__dirname, '../');

const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
//const cors = require('cors');
const systemConfig = require('../config/system');

const { SupremusCore } = require('../index_2');

const app = express();

//app.use(cors());
//app.options('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static(__dirname + '/public/images'));

async function carregarControllers(dir) {
  const files = fs.readdirSync(dir);
  for (let file of files) {
    const dirFile = path.resolve(dir, file);
    if (fs.lstatSync(dirFile).isDirectory() === true) {
      await carregarControllers(dirFile);
    } else if (file.indexOf('.js') !== 0) {
      require(dirFile)(app);
    }
  }
}

async function verificarEstrutura() {
  await SupremusCore.carregarModels(path.resolve(__dirname, 'models'));
  console.log('Database successfully verified. No errors!');

  const folderController = path.resolve(__dirname, 'controllers');
  await carregarControllers(folderController);
  console.log('Controllers loaded.');
}

verificarEstrutura()
  .then(() => {

    let port = systemConfig.port;
    app.listen(port, () => {
      console.log(`Server listening on port ${port} with success`);
    });

  }).catch(error => {
    console.log(error);
  });

module.exports = app;