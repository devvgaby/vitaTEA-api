const { Router } = require('express');
const router = Router();

const cuidadoresRouter = require('./cuidadorRoutes');
const monitoradosRouter = require('./monitoradoRoutes');
const contatosEmergenciaRouter = require('./contatoEmergenciaRoutes');
const cuidadoresMonitoradosRouter = require('./cuidadorMonitoradoRoutes');
const dispositivoRouter = require('./dispositivoRoutes');

router.use('/cuidadores', cuidadoresRouter);
router.use('/monitorados', monitoradosRouter);  
router.use('/contatos-emergencia', contatosEmergenciaRouter);
router.use('/cuidadores-monitorados', cuidadoresMonitoradosRouter);
router.use('/dispositivos', dispositivoRouter);


module.exports = router;