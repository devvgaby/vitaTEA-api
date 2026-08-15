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

router.post("/", criar);
router.get("/", autenticar, listar);
router.get("/:id", autenticar, buscarPorId);
router.put("/:id", autenticar, atualizar);
router.delete("/:id", autenticar, deletar);

module.exports = router;
