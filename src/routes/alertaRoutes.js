const { Router } = require("express");
const router = Router();

const {
  listarPorMonitorado,
  buscarPorId,
  marcarVisualizado,
  deletar,
} = require("../controllers/AlertaController");
const { autenticar } = require("../middlewares/authMiddleware");

router.use(autenticar);

router.get("/monitorado/:id_monitorado", listarPorMonitorado);
router.get("/:id_alerta", buscarPorId);
router.patch("/:id_alerta/visualizar", marcarVisualizado);
router.delete("/:id_alerta", deletar);

module.exports = router;
