const { Router } = require('express');
const router = Router();

const cuidadoresRouter = require('./cuidadorRoutes');
const monitoradosRouter = require('./monitoradoRoutes');
const contatosEmergenciaRouter = require('./contatoEmergenciaRoutes');
const cuidadoresMonitoradosRouter = require('./cuidadorMonitoradoRoutes');
const dispositivosRouter = require('./dispositivoRoutes');
const tiposSinaisRouter = require('./tipoSinalRoutes');

router.use('/cuidadores', cuidadoresRouter);
router.use('/monitorados', monitoradosRouter);  
router.use('/contatos-emergencia', contatosEmergenciaRouter);
router.use('/cuidadores-monitorados', cuidadoresMonitoradosRouter);
router.use('/dispositivos', dispositivosRouter);
router.use('/tipos-sinais', tiposSinaisRouter);

module.exports = router;