const {
  idsMonitoradosDoCuidador,
  cuidadorTemAcesso,
  monitoradoDoDispositivo,
  monitoradoDaLeitura,
  monitoradoDoAlerta,
  monitoradoDoContato,
  monitoradoDoLimite,
} = require("../services/acessoService");

const carregarAcessos = async (req, res, next) => {
  try {
    req.idsMonitorados = await idsMonitoradosDoCuidador(req.cuidador.id_cuidador);
    return next();
  } catch (error) {
    return next(error);
  }
};

const exigirAcesso = (resolver) => async (req, res, next) => {
  try {
    const bruto = await resolver(req);

    if (bruto === null || bruto === undefined) {
      return res.status(404).json({ error: "Recurso não encontrado" });
    }

    const id_monitorado = Number(bruto);
    if (!Number.isInteger(id_monitorado)) {
      return res.status(400).json({ error: "Identificador inválido" });
    }

    const permitido = await cuidadorTemAcesso(req.cuidador.id_cuidador, id_monitorado);
    if (!permitido) {
      return res.status(403).json({ error: "Acesso negado a este monitorado" });
    }

    req.id_monitorado = id_monitorado;
    return next();
  } catch (error) {
    return next(error);
  }
};

const doParametro = (nome) => (req) => req.params[nome];
const doCorpo = (nome) => (req) => req.body?.[nome];

const acessoPorMonitoradoParam = (nome = "id_monitorado") => exigirAcesso(doParametro(nome));
const acessoPorMonitoradoCorpo = (nome = "id_monitorado") => exigirAcesso(doCorpo(nome));
const acessoPorDispositivo = (nome = "id") =>
  exigirAcesso((req) => monitoradoDoDispositivo(req.params[nome]));
const acessoPorLeitura = (nome = "id_leitura_dispositivo") =>
  exigirAcesso((req) => monitoradoDaLeitura(req.params[nome]));
const acessoPorAlerta = (nome = "id_alerta") =>
  exigirAcesso((req) => monitoradoDoAlerta(req.params[nome]));
const acessoPorContato = (nome = "id") =>
  exigirAcesso((req) => monitoradoDoContato(req.params[nome]));
const acessoPorLimite = (nome = "id") =>
  exigirAcesso((req) => monitoradoDoLimite(req.params[nome]));

const somenteProprioCuidador = (nome = "id") => (req, res, next) => {
  if (Number(req.params[nome]) !== Number(req.cuidador.id_cuidador)) {
    return res.status(403).json({ error: "Acesso negado a esta conta" });
  }
  return next();
};

module.exports = {
  carregarAcessos,
  exigirAcesso,
  acessoPorMonitoradoParam,
  acessoPorMonitoradoCorpo,
  acessoPorDispositivo,
  acessoPorLeitura,
  acessoPorAlerta,
  acessoPorContato,
  acessoPorLimite,
  somenteProprioCuidador,
};
