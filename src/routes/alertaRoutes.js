const { Router } = require('express');
const router = Router();

const authRouter = require('./authRoutes');
const cuidadoresRouter = require('./cuidadorRoutes');
const monitoradosRouter = require('./monitoradoRoutes');
const contatosEmergenciaRouter = require('./contatoEmergenciaRoutes');
const cuidadoresMonitoradosRouter = require('./cuidadorMonitoradoRoutes');
const dispositivosRouter = require('./dispositivoRoutes');
const tiposSinaisRouter = require('./tipoSinalRoutes');
const limitesSinais = require('./limiteSinalRoutes');
const leiturasDispositivosRouter = require('./leituraDispositivoRoutes');
const alertasRouter = require('./alertaRoutes');
const relatoriosRouter = require('./relatorioRoutes');

router.use('/auth', authRouter);

router.use('/cuidadores', cuidadoresRouter);
router.use('/monitorados', monitoradosRouter);
router.use('/contatos-emergencia', contatosEmergenciaRouter);
router.use('/cuidadores-monitorados', cuidadoresMonitoradosRouter);
router.use('/dispositivos', dispositivosRouter);
router.use('/tipos-sinais', tiposSinaisRouter);
router.use('/limites-sinais', limitesSinais);
router.use('/leituras-dispositivos', leiturasDispositivosRouter);
router.use('/alertas', alertasRouter);
router.use('/relatorios', relatoriosRouter);

module.exports = router;
