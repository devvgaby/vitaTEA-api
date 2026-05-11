const { Router } = require('express');
const router = Router();

const cuidadoresRouter = require('./cuidadorRoutes');
const monitoradosRouter = require('./monitoradoRoutes');
const contatosEmergenciaRouter = require('./contatoEmergencia');

router.use('/cuidadores', cuidadoresRouter);
router.use('/monitorados', monitoradosRouter);  
router.use('/contatos-emergencia', contatosEmergenciaRouter);

module.exports = router;