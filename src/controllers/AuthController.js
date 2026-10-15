const {
  login: loginService,
  solicitarRedefinicaoSenha,
  redefinirSenha,
} = require("../services/authService");
const { enviarEmailRedefinicaoSenha, smtpConfigurado } = require("../services/emailService");

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
        await enviarEmailRedefinicaoSenha({
          para: resultado.cuidador.email,
          nome: resultado.cuidador.nome,
          resetToken: resultado.resetToken,
        });
      } catch (erro) {
        console.error(`Falha ao enviar e-mail de redefinição: ${erro.message}`);
      }

      if (!smtpConfigurado() && process.env.NODE_ENV !== "production") {
        resetToken = resultado.resetToken;
      }
    }

    return res.status(200).json({
      message: "Se o e-mail estiver cadastrado, enviamos as instruções de redefinição.",
      resetToken,
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao solicitar redefinição de senha" });
  }
};

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

module.exports = { login, esqueciSenha, redefinirSenhaController };
