const { Router } = require("express");
const router = Router();

const {
  criar,
  listar,
  buscarPorId,
  atualizar,
  deletar,
} = require("../controllers/TipoSinalController");
const { autenticar } = require("../middlewares/authMiddleware");

router.get("/", listar);
router.get("/:id", buscarPorId);
router.post("/", autenticar, criar);
router.put("/:id", autenticar, atualizar);
router.delete("/:id", autenticar, deletar);

module.exports = router;
