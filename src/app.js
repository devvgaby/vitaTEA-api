const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const app = express();
const apiRoutes = require("./routes/Routes");

app.use(helmet());

const corsOrigin = process.env.CORS_ORIGIN;
app.use(
  cors({
    origin: corsOrigin || true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json({ limit: "100kb" }));

if (process.env.NODE_ENV !== "test") {
  const limitarAutenticacao = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: Number(process.env.AUTH_RATE_LIMIT || 50),
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Muitas tentativas. Tente novamente em alguns minutos." },
  });
  app.use("/auth", limitarAutenticacao);
}

app.use(apiRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

app.use((err, req, res, next) => {
  console.error(err.message);
  const mensagem =
    process.env.NODE_ENV === "production" ? "Erro interno do servidor" : err.message;
  res.status(err.status || 500).json({ error: mensagem });
});

module.exports = app;
