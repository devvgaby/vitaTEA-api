const { Router } = require("express");
const router = Router();

const {
  criar,
  listar,
  buscarPorId,
  remover,
} = require("../controllers/CuidadorMonitoradoController");

router.post("/", criar);
router.get("/", listar);
router.get("/:id_cuidador/:id_monitorado", buscarPorId);
router.delete("/:id_cuidador/:id_monitorado", remover);

module.exports = router;