const { Router } = require("express");
const router = Router();

const {
  criar,
  listar,
  buscarPorId,
  atualizar,
  deletar,
} = require("../controllers/ContatoEmergenciaController");
const { autenticar } = require("../middlewares/authMiddleware");
const {
  carregarAcessos,
  acessoPorMonitoradoCorpo,
  acessoPorContato,
} = require("../middlewares/acessoMiddleware");

router.use(autenticar);

router.post("/", acessoPorMonitoradoCorpo("id_monitorado"), criar);
router.get("/", carregarAcessos, listar);
router.get("/:id", acessoPorContato("id"), buscarPorId);
router.put("/:id", acessoPorContato("id"), atualizar);
router.delete("/:id", acessoPorContato("id"), deletar);

module.exports = router;
