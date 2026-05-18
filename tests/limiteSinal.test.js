const axios = require("axios");
require("dotenv").config();

const api = `http://localhost:${process.env.PORT || 3000}`;

describe("Limites Sinais", () => {
  test("POST /limites-sinais - Configurar limites de sinais", async () => {
    const monitorado = await axios.post(`${api}/monitorados`, {
      nome: `Monitorado ${Date.now()}`,
      idade: 8,
      nivel_tea: "2",
    });

    const tipoSinal = await axios.post(`${api}/tipos-sinais`, {
      nome: `Frequência Cardíaca ${Date.now()}`,
      unidade_medida: "bpm",
    });

    const res = await axios.post(`${api}/limites-sinais`, {
      id_monitorado: monitorado.data.id_monitorado,
      id_tipo_sinal: tipoSinal.data.id_tipo_sinal,
      valor_min: 60,
      valor_max: 120,
    });

    expect(res.status).toBe(201);

    expect(res.data).toHaveProperty("id_limite_sinal");
    expect(res.data.id_monitorado).toBe(monitorado.data.id_monitorado);
    expect(res.data.id_tipo_sinal).toBe(tipoSinal.data.id_tipo_sinal);
    expect(res.data.valor_min).toBe(60);
    expect(res.data.valor_max).toBe(120);

    await axios.delete(`${api}/limites-sinais/${res.data.id_limite_sinal}`);
    await axios.delete(`${api}/monitorados/${monitorado.data.id_monitorado}`);
    await axios.delete(`${api}/tipos-sinais/${tipoSinal.data.id_tipo_sinal}`);
  });

  test("GET /limites-sinais - Listar os limites sinais", async () => {
    const res = await axios.get(`${api}/limites-sinais`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
  });

  test("GET /limites-sinais/:id - Buscar limite de sinal por ID", async () => {
    const monitorado = await axios.post(`${api}/monitorados`, {
      nome: `Monitorado ${Date.now()}`,
      idade: 9,
      nivel_tea: "3",
    });

    const tipoSinal = await axios.post(`${api}/tipos-sinais`, {
      nome: `SPO2 ${Date.now()}`,
      unidade_medida: "%",
    });

    const limiteSinal = await axios.post(`${api}/limites-sinais`, {
      id_monitorado: monitorado.data.id_monitorado,
      id_tipo_sinal: tipoSinal.data.id_tipo_sinal,
      valor_min: 90,
      valor_max: 100,
    });

    const id = limiteSinal.data.id_limite_sinal;

    const res = await axios.get(`${api}/limites-sinais/${id}`);

    expect(res.status).toBe(200);

    expect(res.data).toHaveProperty("id_limite_sinal", id);
    expect(res.data.id_monitorado).toBe(monitorado.data.id_monitorado);
    expect(res.data.id_tipo_sinal).toBe(tipoSinal.data.id_tipo_sinal);
    expect(res.data.valor_min).toBe(90);
    expect(res.data.valor_max).toBe(100);

    await axios.delete(`${api}/limites-sinais/${id}`);
    await axios.delete(`${api}/monitorados/${monitorado.data.id_monitorado}`);
    await axios.delete(`${api}/tipos-sinais/${tipoSinal.data.id_tipo_sinal}`);
  });

  test("GET /limites-sinais/:id_limite_sinal/:id_monitorado - Buscar os limites de sinais pelo monitorado", async () => {
    const monitorado = await axios.post(`${api}/monitorados`, {
      nome: `Monitorado ${Date.now()}`,
      idade: 10,
      nivel_tea: "3",
    });

    const tipoSinal = await axios.post(`${api}/tipos-sinais`, {
      nome: `Temperatura ${Date.now()}`,
      unidade_medida: "°C",
    });

    const limiteSinal = await axios.post(`${api}/limites-sinais`, {
      id_monitorado: monitorado.data.id_monitorado,
      id_tipo_sinal: tipoSinal.data.id_tipo_sinal,
      valor_min: 36.0,
      valor_max: 37.0,
    });

    const idLimite = limiteSinal.data.id_limite_sinal;
    const idMonitorado = monitorado.data.id_monitorado;

    const res = await axios.get(
      `${api}/limites-sinais/${idLimite}/${idMonitorado}`,
    );

    expect(res.status).toBe(200);

    expect(res.data).toHaveProperty("id_limite_sinal");

    await axios.delete(`${api}/limites-sinais/${idLimite}`);
    await axios.delete(`${api}/monitorados/${idMonitorado}`);
    await axios.delete(`${api}/tipos-sinais/${tipoSinal.data.id_tipo_sinal}`);
  });

  test("PUT /limites-sinais/:id - Atualizar limite de sinal", async () => {
    const monitorado = await axios.post(`${api}/monitorados`, {
      nome: `Monitorado ${Date.now()}`,
      idade: 10,
      nivel_tea: "3",
    });

    const tipoSinal = await axios.post(`${api}/tipos-sinais`, {
      nome: `Frequência Cardíaca ${Date.now()}`,
      unidade_medida: "bpm",
    });

    const limite = await axios.post(`${api}/limites-sinais`, {
      id_monitorado: monitorado.data.id_monitorado,
      id_tipo_sinal: tipoSinal.data.id_tipo_sinal,
      valor_min: 60,
      valor_max: 120,
    });

    const id = limite.data.id_limite_sinal;

    const res = await axios.put(`${api}/limites-sinais/${id}`, {
      valor_min: 65,
      valor_max: 110,
    });

    expect(res.status).toBe(200);
    expect(res.data.valor_min).toBe(65);
    expect(res.data.valor_max).toBe(110);

    await axios.delete(`${api}/limites-sinais/${id}`);
    await axios.delete(`${api}/monitorados/${monitorado.data.id_monitorado}`);
    await axios.delete(`${api}/tipos-sinais/${tipoSinal.data.id_tipo_sinal}`);
  });

  test("DELETE /limites-sinais/:id - Deletar limite de sinal", async () => {
    const monitorado = await axios.post(`${api}/monitorados`, {
      nome: `Monitorado ${Date.now()}`,
      idade: 11,
      nivel_tea: "2",
    });

    const tipoSinal = await axios.post(`${api}/tipos-sinais`, {
      nome: `SPO2 ${Date.now()}`,
      unidade_medida: "%",
    });

    const limite = await axios.post(`${api}/limites-sinais`, {
      id_monitorado: monitorado.data.id_monitorado,
      id_tipo_sinal: tipoSinal.data.id_tipo_sinal,
      valor_min: 90,
      valor_max: 100,
    });

    const id = limite.data.id_limite_sinal;

    const res = await axios.delete(`${api}/limites-sinais/${id}`);

    expect(res.status).toBe(204);

    await axios.delete(`${api}/monitorados/${monitorado.data.id_monitorado}`);
    await axios.delete(`${api}/tipos-sinais/${tipoSinal.data.id_tipo_sinal}`);
  });
});
