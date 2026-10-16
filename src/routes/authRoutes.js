const express = require("express");
const router = express.Router();

const {
  login,
  esqueciSenha,
  redefinirSenhaApp,
  paginaRedefinirSenha,
  redefinirSenhaWeb,
} = require("../controllers/AuthController");

const lerFormulario = express.urlencoded({ extended: false, limit: "10kb" });

router.post("/login", login);
router.post("/esqueci-senha", esqueciSenha);
router.post("/redefinir-senha", redefinirSenhaApp);

router.get("/redefinir-senha", paginaRedefinirSenha);
router.post("/redefinir-senha/web", lerFormulario, redefinirSenhaWeb);

module.exports = router;