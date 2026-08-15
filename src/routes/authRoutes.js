const { Router } = require("express");
const router = Router();

const { login, esqueciSenha, redefinirSenhaController } = require("../controllers/AuthController");

router.post("/login", login);
router.post("/esqueci-senha", esqueciSenha);
router.post("/redefinir-senha", redefinirSenhaController);

module.exports = router;
