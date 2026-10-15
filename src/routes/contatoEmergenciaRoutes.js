const { Router } = require("express");
const router = Router();

const {
  listarPorMonitorado,
  buscarPorId,
  marcarVisualizado,
  deletar,
} = require("../controllers/AlertaController");
const { autenticar } = require("../middlewares/authMiddleware");
const { acessoPorMonitoradoParam, acessoPorAlerta } = require("../middlewares/acessoMiddleware");

router.use(autenticar);

router.get("/monitorado/:id_monitorado", acessoPorMonitoradoParam("id_monitorado"), listarPorMonitorado);
router.get("/:id_alerta", acessoPorAlerta("id_alerta"), buscarPorId);
router.patch("/:id_alerta/visualizar", acessoPorAlerta("id_alerta"), marcarVisualizado);
router.delete("/:id_alerta", acessoPorAlerta("id_alerta"), deletar);

module.exports = router;
