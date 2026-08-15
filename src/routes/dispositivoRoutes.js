const { Router } = require("express");

const router = Router();

const {
  criar,
  listar,
  buscarPorId,
  buscarPorMonitorado,
  status,
  atualizar,
  deletar,
} = require("../controllers/DispositivoController");
const { autenticar } = require("../middlewares/authMiddleware");

// Todas as rotas deste recurso exigem cuidador autenticado (RN11).
router.use(autenticar);

router.post("/", criar);

router.get("/", listar);

router.get("/:id/status", status);

router.get("/:id_dispositivo/:id_monitorado", buscarPorMonitorado);

router.get("/:id", buscarPorId);

router.put("/:id", atualizar);

router.delete("/:id", deletar);

module.exports = router;
