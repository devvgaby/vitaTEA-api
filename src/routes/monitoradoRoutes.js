const { Router } = require("express");
const router = Router();

const {
  criar,
  listar,
  buscarPorId,
  atualizar,
  deletar,
} = require("../controllers/MonitoradoController");
const { autenticar } = require("../middlewares/authMiddleware");
const { carregarAcessos, acessoPorMonitoradoParam } = require("../middlewares/middlewareAcess");

router.use(autenticar);

router.post("/", criar);
router.get("/", carregarAcessos, listar);
router.get("/:id", acessoPorMonitoradoParam("id"), buscarPorId);
router.put("/:id", acessoPorMonitoradoParam("id"), atualizar);
router.delete("/:id", acessoPorMonitoradoParam("id"), deletar);

module.exports = router;