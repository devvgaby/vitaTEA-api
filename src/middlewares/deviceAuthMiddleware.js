const { Dispositivo } = require("../models");

const autenticarDispositivo = async (req, res, next) => {
  try {
    const { id_dispositivo, codigo } = req.body;

    if (!id_dispositivo || !codigo) {
      return res.status(400).json({
        error: "id_dispositivo e codigo são obrigatórios para autenticar o dispositivo",
      });
    }

    const dispositivo = await Dispositivo.findByPk(id_dispositivo);

    if (!dispositivo || dispositivo.codigo !== codigo) {
      return res.status(401).json({ error: "Dispositivo ou código inválido" });
    }

    req.dispositivo = dispositivo;
    return next();
  } catch (error) {
    return res.status(500).json({ error: "Erro ao autenticar dispositivo" });
  }
};

module.exports = { autenticarDispositivo };
