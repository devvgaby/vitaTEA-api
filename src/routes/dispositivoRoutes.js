const { Router } = require("express");

const router = Router();

const {
  criar,
  listar,
  buscarPorId,
  buscarPorMonitorado,
  atualizar,
  deletar,
} = require("../controllers/DispositivoController");

router.post("/", criar);

router.get("/", listar);

router.get("/:id_dispositivo/:id_monitorado", buscarPorMonitorado);

router.get("/:id", buscarPorId);

router.put("/:id", atualizar);

router.delete("/:id", deletar);

module.exports = router;
