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
const { autenticar } = require("../middlewares/authMiddleware");
const {
  carregarAcessos,
  acessoPorMonitoradoCorpo,
  acessoPorMonitoradoParam,
  acessoPorLimite,
} = require("../middlewares/middlewareAcess");

router.use(autenticar);

router.post("/", acessoPorMonitoradoCorpo("id_monitorado"), criar);
router.get("/", carregarAcessos, listar);
router.get("/:id_limite_sinal/:id_monitorado", acessoPorMonitoradoParam("id_monitorado"), buscarPorMonitorado);
router.get("/:id", acessoPorLimite("id"), buscarPorId);
router.put("/:id", acessoPorLimite("id"), atualizar);
router.delete("/:id", acessoPorLimite("id"), deletar);

module.exports = router;
