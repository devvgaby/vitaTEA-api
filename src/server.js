require("dotenv").config();

const fs = require("fs");
const http = require("http");
const https = require("https");
const app = require("./app");
const { diagnosticarEmail } = require("./services/emailService");

const PORT = process.env.PORT || 3000;

if (!process.env.JWT_SECRET) {
  console.error("Defina JWT_SECRET no arquivo .env antes de iniciar o servidor.");
  process.exit(1);
}

const { SSL_KEY_PATH, SSL_CERT_PATH } = process.env;

if (SSL_KEY_PATH && SSL_CERT_PATH) {
  const credenciais = {
    key: fs.readFileSync(SSL_KEY_PATH),
    cert: fs.readFileSync(SSL_CERT_PATH),
  };

  https.createServer(credenciais, app).listen(PORT, () => {
    console.log(`Rodando com HTTPS na porta ${PORT}`);
  });
} else {
  http.createServer(app).listen(PORT, () => {
    console.log(`Rodando na porta ${PORT}`);
  });
}

// Avisa na inicialização se a recuperação de senha por e-mail não vai funcionar
// (SMTP ausente, credencial recusada, URL pública inválida). Não imprime segredos.
diagnosticarEmail().then((problemas) => {
  if (problemas.length === 0) {
    console.log("[e-mail] SMTP verificado e URL pública configurada: recuperação de senha pronta.");
    return;
  }
  problemas.forEach((p) => console.error(`[e-mail] PROBLEMA: ${p}`));
  console.error("[e-mail] A recuperação de senha por e-mail NÃO vai funcionar até corrigir os itens acima.");
  if (process.env.NODE_ENV === "production") process.exit(1);
});