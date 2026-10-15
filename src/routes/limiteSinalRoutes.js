const { Router } = require("express");
const router = Router();

const {
  criar,
  buscarPorId,
  listar,
  buscarPorDispositivo,
  atualizar,
  deletar,
} = require("../controllers/LeituraDispositivoController");
const { autenticarDispositivo } = require("../middlewares/deviceAuthMiddleware");
const { autenticar } = require("../middlewares/authMiddleware");
const {
  carregarAcessos,
  acessoPorLeitura,
  acessoPorDispositivo,
} = require("../middlewares/middlewareAcess");

router.post("/", autenticarDispositivo, criar);

router.get("/", autenticar, carregarAcessos, listar);
router.get("/dispositivo/:id_dispositivo", autenticar, acessoPorDispositivo("id_dispositivo"), buscarPorDispositivo);
router.get("/:id_leitura_dispositivo", autenticar, acessoPorLeitura("id_leitura_dispositivo"), buscarPorId);
router.put("/:id_leitura_dispositivo", autenticar, acessoPorLeitura("id_leitura_dispositivo"), atualizar);
router.delete("/:id_leitura_dispositivo", autenticar, acessoPorLeitura("id_leitura_dispositivo"), deletar);

module.exports = router;
