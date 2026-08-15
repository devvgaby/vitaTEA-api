const JANELA_CONEXAO_MS = 2 * 60 * 1000; 

const LIMITES_PADRAO = {
  "Frequência Cardíaca": { valor_min: 60, valor_max: 120 },
  "Saturação de Oxigênio": { valor_min: 95, valor_max: 100 },
  "Temperatura Corporal": { valor_min: 36.0, valor_max: 37.8 },
  "Frequência Respiratória": { valor_min: 16, valor_max: 30 },
};

const FAIXAS_CRITICIDADE = [
  { ateDesvio: 0.1, nivel: "medio" },
  { ateDesvio: 0.25, nivel: "alto" },
  { ateDesvio: Infinity, nivel: "critico" },
];

module.exports = { JANELA_CONEXAO_MS, LIMITES_PADRAO, FAIXAS_CRITICIDADE };
