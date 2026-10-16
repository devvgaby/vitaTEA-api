const { Router } = require("express");
const router = Router();

const { resumo, csv } = require("../controllers/RelatorioController");
const { autenticar } = require("../middlewares/authMiddleware");
const { acessoPorMonitoradoParam } = require("../middlewares/middlewareAcess");

router.use(autenticar);

router.get("/monitorado/:id_monitorado", acessoPorMonitoradoParam("id_monitorado"), resumo);
router.get("/monitorado/:id_monitorado/csv", acessoPorMonitoradoParam("id_monitorado"), csv);

module.exports = router;