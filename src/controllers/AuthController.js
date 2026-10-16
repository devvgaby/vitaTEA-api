const {
  login: loginService,
  solicitarRedefinicaoSenha,
  buscarCuidadorPorResetToken,
  redefinirSenha,
} = require("../services/authService");
const {
  enviarEmailRedefinicaoSenha,
  smtpConfigurado,
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

const esqueciSenha = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "E-mail é obrigatório" });
    }

    const resultado = await solicitarRedefinicaoSenha(email);

    let resetToken;
    if (resultado) {
      try {
        const envio = await enviarEmailRedefinicaoSenha({
          para: resultado.cuidador.email,
          nome: resultado.cuidador.nome,
          resetToken: resultado.resetToken,
        });
        console.log(
          envio.simulado
            ? `[redefinição de senha] SIMULADO (SMTP_HOST vazio): nenhum e-mail real foi enviado para ${resultado.cuidador.email}`
            : `[redefinição de senha] e-mail ENVIADO pelo SMTP para ${resultado.cuidador.email}`,
        );
      } catch (erro) {
        console.error(
          `[redefinição de senha] FALHA ao enviar e-mail para ${resultado.cuidador.email}: ${erro.message}`,
        );
        const dica = explicarErroSmtp(erro);
        if (dica) console.error(`  -> ${dica}`);
      }

      // Só em desenvolvimento e sem SMTP a API devolve o código na resposta.
      if (!smtpConfigurado() && process.env.NODE_ENV !== "production") {
        resetToken = resultado.resetToken;
      }
    }

    // A resposta é sempre a mesma, exista o e-mail ou não (não revela quem tem conta).
    return res.status(200).json({
      message: "Se o e-mail estiver cadastrado, enviamos as instruções de redefinição.",
      resetToken,
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao solicitar redefinição de senha" });
  }
};

// Usado pelo aplicativo (envia JSON).
const redefinirSenhaController = async (req, res) => {
  try {
    const { resetToken, novaSenha } = req.body;

    if (!resetToken || !novaSenha) {
      return res.status(400).json({ error: "resetToken e novaSenha são obrigatórios" });
    }

    if (String(novaSenha).length < TAMANHO_MINIMO_SENHA) {
      return res
        .status(400)
        .json({ error: `A senha deve ter pelo menos ${TAMANHO_MINIMO_SENHA} caracteres` });
    }

    const sucesso = await redefinirSenha(resetToken, novaSenha);

    if (!sucesso) {
      return res.status(400).json({ error: "Token inválido ou expirado" });
    }

    return res.status(200).json({ message: "Senha redefinida com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao redefinir senha" });
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
  redefinirSenhaController,
  paginaRedefinirSenha,
  redefinirSenhaWeb,
};