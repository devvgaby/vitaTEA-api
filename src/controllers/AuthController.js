const {
  login: loginService,
  solicitarRedefinicaoSenha,
  redefinirSenha,
} = require("../services/authService");

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

    const resetToken = await solicitarRedefinicaoSenha(email);

    return res.status(200).json({
      message: "Se o e-mail existir, um link de redefinição foi enviado.",
      resetToken: resetToken || undefined,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erro ao solicitar redefinição de senha" });
  }
};

const redefinirSenhaController = async (req, res) => {
  try {
    const { resetToken, novaSenha } = req.body;

    if (!resetToken || !novaSenha) {
      return res
        .status(400)
        .json({ error: "resetToken e novaSenha são obrigatórios" });
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
