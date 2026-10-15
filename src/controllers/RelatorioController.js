const { gerarRelatorio, gerarCsv } = require("../services/relatorioService");

const resumo = async (req, res) => {
  try {
    const { periodo, desde, ate } = req.query;
    const relatorio = await gerarRelatorio(req.params.id_monitorado, { periodo, desde, ate });

    if (relatorio.erro) {
      return res.status(relatorio.naoEncontrado ? 404 : 400).json({ error: relatorio.erro });
    }

    return res.status(200).json(relatorio);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao gerar o relatório" });
  }
};

const csv = async (req, res) => {
  try {
    const { periodo, desde, ate } = req.query;
    const resultado = await gerarCsv(req.params.id_monitorado, { periodo, desde, ate });

    if (resultado.erro) {
      return res.status(400).json({ error: resultado.erro });
    }

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="vitatea-monitorado-${req.params.id_monitorado}.csv"`,
    );
    return res.status(200).send(resultado.csv);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao exportar as leituras" });
  }
};

module.exports = { resumo, csv };