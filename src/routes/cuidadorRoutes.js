const { Router } = require("express");
const router = Router();

const {
  criar,
  listar,
  buscarPorId,
  atualizar,
  deletar,
} = require("../controllers/CuidadorController");
const { autenticar } = require("../middlewares/authMiddleware");
const { somenteProprioCuidador } = require("../middlewares/middlewareAcess");

router.post("/", criar);
router.get("/", autenticar, listar);
router.get("/:id", autenticar, somenteProprioCuidador("id"), buscarPorId);
router.put("/:id", autenticar, somenteProprioCuidador("id"), atualizar);
router.delete("/:id", autenticar, somenteProprioCuidador("id"), deletar);

module.exports = router;