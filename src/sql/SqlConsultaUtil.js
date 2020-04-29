const ModelManager = require('../estrutura/model/ModelManager');

const operadores = ["=", ">", "<", "<>", ">=", "<=", "LIKE", "BETWEEN"];
const ordenadores = ["ASC", "DESC"];

class SqlConsultaUtil {

  getCriterio(configs) {
    const criterioConsulta = [];

    for (let [key, config] of configs) {
      const criterios = config.criterios;
      if (criterios === undefined) {
        continue;
      }

      const model = ModelManager.getModel(config.tabela);

      for (const c of criterios) {
        if (c instanceof Array) {
          const crs = ["("];
          let comparador = "";
          for (const cr of c) {
            comparador = cr.comparador ? cr.comparador.toUpperCase() : "AND";
            const crr = this.getDadosCriterio(key, model, cr);
            crs.push(crr);
            crs.push(comparador);
          }

          crs.pop();
          crs.push(")");
          crs.push(comparador);
          criterioConsulta.push(crs.join(" "));
        } else {
          const cr = this.getDadosCriterio(key, model, c);
          criterioConsulta.push(cr);
          criterioConsulta.push(
            c.comparador ? c.comparador.toUpperCase() : "AND"
          );
        }
      }
    }

    if (criterioConsulta.length === 0) {
      return undefined;
    }

    criterioConsulta.pop();
    return criterioConsulta.join(" ");
  }

  getDadosCriterio(key, model, criterio) {
    const campo = model.getCampo(criterio.campo);
    if (campo === undefined) {
      throw new Error(`O campo ${criterio.campo} não foi localizado.`);
    }

    const cop = criterio.operador || "=";
    let operador = operadores.find(op => op === cop.toUpperCase());
    if (operador === undefined) {
      throw new Error(
        `Operador não localizado ${criterio.operador}: ${JSON.stringify(
          criterio
        )}`
      );
    }

    const valores = [];
    if (criterio.valor instanceof Array) {
      operador = "BETWEEN";
      valores.push(campo.getValorSql(criterio.valor[0]));
      valores.push("AND");
      valores.push(campo.getValorSql(criterio.valor[1]));
    } else {
      valores.push(campo.getValorSql(criterio.valor));
    }

    return `${key}.${campo.getNome()} ${operador} ${valores.join(" ")}`;
  }

  getDadosOrdem(configs, ordem) {
    if (ordem === undefined) {
      return undefined;
    }

    const key1 = configs.keys().next().value;

    const ordens = [];
    for (const ord of ordem) {
      const s = ord.split(" ");
      const op = s[1];
      let key = key1;
      let nome = s[0];
      if (s[0].indexOf('.') > -1) {
        const s2 = s[0].split('.');
        key = s2[0];
        nome = s2[1];
      }

      const model = ModelManager.getModel(configs.get(key).tabela);
      const campo = model.getCampo(nome);
      if (campo === undefined) {
        throw new Error(`O campo ${nome} não foi localizado.`);
      }

      if (op === undefined) {
        ordens.push(`${key}.${campo.getNome()}`);
      } else {
        const operador = ordenadores.find(u => u === op.toUpperCase());
        if (operador === undefined) {
          throw new Error(`Ordenador ${s[1]} não foi localizado. ${ord}`);
        }
        ordens.push(`${key}.${campo.getNome()} ${operador}`);
      }
    }

    return ordens.join(", ");
  }
}

module.exports = SqlConsultaUtil;
