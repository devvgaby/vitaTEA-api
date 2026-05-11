const { Router } = require("express");
const router = Router();

const {
  criar,
  listar,
  remover,
} = require("../controllers/CuidadorMonitoradoController");

router.post("/", criar);
router.get("/", listar);
router.delete("/", remover);

module.exports = router;