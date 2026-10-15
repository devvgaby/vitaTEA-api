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
const {
  carregarAcessos,
  acessoPorMonitoradoCorpo,
  acessoPorMonitoradoParam,
  acessoPorDispositivo,
} = require("../middlewares/acessoMiddleware");

router.use(autenticar);

router.post("/", acessoPorMonitoradoCorpo("id_monitorado"), criar);
router.get("/", carregarAcessos, listar);
router.get("/:id/status", acessoPorDispositivo("id"), status);
router.get("/:id_dispositivo/:id_monitorado", acessoPorMonitoradoParam("id_monitorado"), buscarPorMonitorado);
router.get("/:id", acessoPorDispositivo("id"), buscarPorId);
router.put(
  "/:id",
  acessoPorDispositivo("id"),
  (req, res, next) =>
    req.body?.id_monitorado !== undefined
      ? acessoPorMonitoradoCorpo("id_monitorado")(req, res, next)
      : next(),
  atualizar,
);
router.delete("/:id", acessoPorDispositivo("id"), deletar);

module.exports = router;
