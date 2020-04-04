const operadores = ["=", ">", "<", "<>", ">=", "<=", "LIKE", "BETWEEN"];
const ordenadores = ["ASC", "DESC"];

class SqlConsultaUtil {
  getCriterio(key, model, criterio) {
    if (criterio === undefined) {
      return undefined;
    }

    const criterioConsulta = [];

    for (const c of criterio) {
      if (c.criterio instanceof Array) {
        const crs = ["("];
        let comparador = "";
        for (const cr of c.criterio) {
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
        const cr = this.getDadosCriterio(key, model, c.criterio);
        criterioConsulta.push(cr);
        criterioConsulta.push(
          c.criterio.comparador ? c.criterio.comparador.toUpperCase() : "AND"
        );
      }
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

  getDadosOrdem(key, model, ordem) {
    if (ordem === undefined) {
      return undefined;
    }

    const ordens = [];
    for (const ord of ordem) {
      const s = ord.split(" ");
      const nome = s[0];
      const campo = model.getCampo(nome);
      if (campo === undefined) {
        throw new Error(`O campo ${nome} não foi localizado.`);
      }

      if (s.length === 1) {
        ordens.push(`${key}.${campo.getNome()}`);
      } else {
        const op = ordenadores.find(u => u === s[1].toUpperCase());
        if (op === undefined) {
          throw new Error(`Ordenador ${s[1]} não foi localizado. ${ord}`);
        }
        ordens.push(`${key}.${campo.getNome()} ${op}`);
      }
    }

    return ordens.join(", ");
  }
}

module.exports = SqlConsultaUtil;
