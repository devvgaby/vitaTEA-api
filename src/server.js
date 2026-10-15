require("dotenv").config();

const fs = require("fs");
const http = require("http");
const https = require("https");
const app = require("./app");

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
