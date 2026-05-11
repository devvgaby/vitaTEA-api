const { Router } = require("express");
const router = Router();

const {
    criar,
    listar,
    buscarPorId,
    atualizar,
    deletar
} = require("../controllers/ContatoEmergenciaController");

router.post("/", criar);
router.get("/", listar);
router.get("/:id", buscarPorId);
router.put("/:id", atualizar);
router.delete("/:id", deletar);

module.exports = router;