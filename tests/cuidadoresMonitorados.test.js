const axios = require("axios");
require("dotenv").config();

const api = `http://localhost:${process.env.PORT || 3000}`;

describe("Cuidadores x Monitorados (Relacionamento)", () => {
  test("POST /cuidadores-monitorados - Vincular cuidador e monitorado", async () => {
    const cuidador = await axios.post(`${api}/cuidadores`, {
      nome: "Cuidador Rel",
      email: `cuidador${Date.now()}@email.com`,
      senha: "123456",
    });

    const monitorado = await axios.post(`${api}/monitorados`, {
      nome: "Monitorado Rel",
      idade: 10,
      nivel_tea: "2",
    });

    const res = await axios.post(`${api}/cuidadores-monitorados`, {
      id_cuidador: cuidador.data.id_cuidador,
      id_monitorado: monitorado.data.id_monitorado,
    });

    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty("id_cuidador");
    expect(res.data).toHaveProperty("id_monitorado");

    await axios.delete(`${api}/cuidadores/${cuidador.data.id_cuidador}`);
    await axios.delete(`${api}/monitorados/${monitorado.data.id_monitorado}`);
  });

  test("GET /cuidadores-monitorados - Listar relações", async () => {
    const res = await axios.get(`${api}/cuidadores-monitorados`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
  });

  test("GET /cuidadores-monitorados/:id - Buscar por ID", async () => {
    const cuidador = await axios.post(`${api}/cuidadores`, {
      nome: "Cuidador Get",
      email: `get${Date.now()}@email.com`,
      senha: "123456",
    });

    const monitorado = await axios.post(`${api}/monitorados`, {
      nome: "Monitorado Get",
      idade: 12,
      nivel_tea: "2",
    });

    const relacao = await axios.post(`${api}/cuidadores-monitorados`, {
      id_cuidador: cuidador.data.id_cuidador,
      id_monitorado: monitorado.data.id_monitorado,
    });

    const res = await axios.get(
      `${api}/cuidadores-monitorados/${relacao.data.id_cuidador}/${relacao.data.id_monitorado}`,
    );

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty("id_cuidador");
    expect(res.data).toHaveProperty("id_monitorado");

    await axios.delete(`${api}/cuidadores/${cuidador.data.id_cuidador}`);
    await axios.delete(`${api}/monitorados/${monitorado.data.id_monitorado}`);
  });

  test("DELETE /cuidadores-monitorados - Remover vínculo", async () => {
    const cuidador = await axios.post(`${api}/cuidadores`, {
      nome: "Cuidador Del",
      email: `del${Date.now()}@email.com`,
      senha: "123456",
    });

    const monitorado = await axios.post(`${api}/monitorados`, {
      nome: "Monitorado Del",
      idade: 11,
      nivel_tea: "3",
    });

    const relacao = await axios.post(`${api}/cuidadores-monitorados`, {
      id_cuidador: cuidador.data.id_cuidador,
      id_monitorado: monitorado.data.id_monitorado,
    });

    const res = await axios.delete(
      `${api}/cuidadores-monitorados/${relacao.data.id_cuidador}/${relacao.data.id_monitorado}`,
    );

    expect(res.status).toBe(204);

    await axios.delete(`${api}/cuidadores/${cuidador.data.id_cuidador}`);
    await axios.delete(`${api}/monitorados/${monitorado.data.id_monitorado}`);
  });
});