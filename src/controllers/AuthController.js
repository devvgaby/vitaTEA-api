const {
  login: loginService,
  solicitarRedefinicaoSenha,
  buscarCuidadorPorResetToken,
  redefinirSenha,
} = require("../services/authService");
const {
  enviarEmailRedefinicaoSenha,
  explicarErroSmtp,
} = require("../services/emailService");
const paginas = require("../views/paginaRedefinirSenha");

const TAMANHO_MINIMO_SENHA = 6;

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: "E-mail e senha são obrigatórios" });
    }

    const resultado = await loginService(email, senha);

    if (!resultado) {
      return res.status(401).json({ error: "E-mail ou senha inválidos" });
    }

    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao efetuar login" });
  }
};

const MENSAGEM_ESQUECI_SENHA =
  "Se o e-mail estiver cadastrado, enviamos um link de redefinição para ele. Confira também a caixa de spam.";

// Envia o e-mail em segundo plano: assim a resposta demora o mesmo tempo exista
// o e-mail ou não, e um SMTP lento não deixa o aplicativo esperando.
// Nada que contenha o token (link, código) é registrado em log.
const enviarLinkEmSegundoPlano = ({ cuidador, resetToken }) => {
  enviarEmailRedefinicaoSenha({
    para: cuidador.email,
    nome: cuidador.nome,
    resetToken,
  })
    .then(() => {
      console.log(`[redefinição de senha] e-mail enviado pelo SMTP (cuidador ${cuidador.id_cuidador})`);
    })
    .catch((erro) => {
      console.error(
        `[redefinição de senha] FALHA ao enviar e-mail (cuidador ${cuidador.id_cuidador}): ${erro.code || erro.name}: ${erro.message}`,
      );
      const dica = explicarErroSmtp(erro);
      if (dica) console.error(`  -> ${dica}`);
    });
};

const esqueciSenha = async (req, res) => {
  try {
    const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";

    if (!email) {
      return res.status(400).json({ error: "E-mail é obrigatório" });
    }

    const resultado = await solicitarRedefinicaoSenha(email);

    if (resultado) {
      enviarLinkEmSegundoPlano(resultado);
    }

    // A resposta é sempre a mesma, exista o e-mail ou não, e NUNCA contém o token.
    return res.status(200).json({ message: MENSAGEM_ESQUECI_SENHA });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao solicitar redefinição de senha" });
  }
};

// ---------- Página web aberta pelo link do e-mail ----------

const mascararEmail = (email) => {
  const [usuario = "", dominio = ""] = String(email).split("@");
  return `${usuario.slice(0, 2)}***@${dominio}`;
};

// Política de segurança só para estas páginas. A padrão do helmet inclui
// "upgrade-insecure-requests", que faria o navegador do celular tentar HTTPS
// no envio do formulário e falhar quando o backend roda em http://IP:3000.
const enviarPagina = (res, status, html) => {
  res.status(status);
  res.set({
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
    "Referrer-Policy": "no-referrer",
    "Content-Security-Policy":
      "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
  });
  return res.send(html);
};

const paginaRedefinirSenha = async (req, res) => {
  try {
    const token = typeof req.query.token === "string" ? req.query.token : "";
    const cuidador = await buscarCuidadorPorResetToken(token);

    if (!cuidador) return enviarPagina(res, 400, paginas.linkInvalido());

    return enviarPagina(
      res,
      200,
      paginas.formulario({ token, emailMascarado: mascararEmail(cuidador.email) }),
    );
  } catch (error) {
    return enviarPagina(res, 500, paginas.linkInvalido());
  }
};

const redefinirSenhaWeb = async (req, res) => {
  try {
    const { resetToken, novaSenha, confirmarSenha } = req.body || {};
    const token = typeof resetToken === "string" ? resetToken : "";

    const cuidador = await buscarCuidadorPorResetToken(token);
    if (!cuidador) return enviarPagina(res, 400, paginas.linkInvalido());

    const reexibir = (erro) =>
      enviarPagina(
        res,
        400,
        paginas.formulario({ token, emailMascarado: mascararEmail(cuidador.email), erro }),
      );

    if (typeof novaSenha !== "string" || novaSenha.length < TAMANHO_MINIMO_SENHA) {
      return reexibir(`A senha deve ter pelo menos ${TAMANHO_MINIMO_SENHA} caracteres.`);
    }

    if (novaSenha !== confirmarSenha) {
      return reexibir("As senhas não são iguais. Digite novamente.");
    }

    const sucesso = await redefinirSenha(token, novaSenha);
    if (!sucesso) return enviarPagina(res, 400, paginas.linkInvalido());

    return enviarPagina(res, 200, paginas.sucesso());
  } catch (error) {
    return enviarPagina(res, 500, paginas.linkInvalido());
  }
};

module.exports = {
  login,
  esqueciSenha,
  paginaRedefinirSenha,
  redefinirSenhaWeb,
};