const { Router } = require("express");
const router = Router();

const {
  criar,
  listar,
  buscarPorId,
  remover,
} = require("../controllers/CuidadorMonitoradoController");
const { autenticar } = require("../middlewares/authMiddleware");
const { carregarAcessos, acessoPorMonitoradoParam } = require("../middlewares/middlewareAcess");

router.use(autenticar);

router.post("/", criar); 
router.get("/", carregarAcessos, listar);
router.get("/:id_cuidador/:id_monitorado", acessoPorMonitoradoParam("id_monitorado"), buscarPorId);
router.delete("/:id_cuidador/:id_monitorado", acessoPorMonitoradoParam("id_monitorado"), remover);

module.exports = router;
