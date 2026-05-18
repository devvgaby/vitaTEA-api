const { Router } = require("express");
const router = Router();

const {
  criar,
  listar,
  buscarPorId,
  buscarPorMonitorado,
  atualizar,
  deletar,
} = require("../controllers/LimiteSinalController");

router.post("/", criar);
router.get("/", listar);
router.get("/:id", buscarPorId);
router.get("/:id_limite_sinal/:id_monitorado", buscarPorMonitorado);
router.put("/:id", atualizar);
router.delete("/:id", deletar);

module.exports = router;
