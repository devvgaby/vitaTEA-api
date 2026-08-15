const { Router } = require('express');
const router = Router();

const {
  criar,
  buscarPorId,
  listar,
  buscarPorDispositivo,
  atualizar,
  deletar,
} = require('../controllers/LeituraDispositivoController');
const { autenticarDispositivo } = require('../middlewares/deviceAuthMiddleware');
const { autenticar } = require('../middlewares/authMiddleware');

router.post('/', autenticarDispositivo, criar);
router.get('/:id_leitura_dispositivo', autenticar, buscarPorId);
router.get('/', autenticar, listar);
router.get('/dispositivo/:id_dispositivo', autenticar, buscarPorDispositivo);
router.put('/:id_leitura_dispositivo', autenticar, atualizar);
router.delete('/:id_leitura_dispositivo', autenticar, deletar);

module.exports = router;