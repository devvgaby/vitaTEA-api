const axios = require("axios");
require("dotenv").config();

const api = `http://localhost:${process.env.PORT || 3000}`;

describe("Dispositivo", () => {
  test("POST /dispositivos - Criar dispositivo", async () => {
    const monitorado = await axios.post(`${api}/monitorados`, {
      nome: `Monitorado Disp ${Date.now()}`,
      idade: 8,
      nivel_tea: "2",
    });

    const res = await axios.post(`${api}/dispositivos`, {
      codigo: `DISP-${Date.now()}`,
      id_monitorado: monitorado.data.id_monitorado,
    });

    expect(res.status).toBe(201);

    expect(res.data).toHaveProperty("id_dispositivo");
    expect(res.data.codigo).toContain("DISP-");

    expect(res.data.id_monitorado).toBe(monitorado.data.id_monitorado);
  });

  test("GET /dispositivos/:id - Buscar dispositivo", async () => {
    const monitorado = await axios.post(`${api}/monitorados`, {
      nome: `Monitorado Busca ${Date.now()}`,
      idade: 10,
      nivel_tea: "1",
    });

    const dispositivo = await axios.post(`${api}/dispositivos`, {
      codigo: `DISP-${Date.now()}`,
      id_monitorado: monitorado.data.id_monitorado,
    });

    const res = await axios.get(
      `${api}/dispositivos/${dispositivo.data.id_dispositivo}`,
    );

    expect(res.status).toBe(200);

    expect(res.data.id_dispositivo).toBe(dispositivo.data.id_dispositivo);

    expect(res.data.codigo).toBe(dispositivo.data.codigo);
  });

  test("GET /dispositivos - Listar dispositivos", async () => {
    const res = await axios.get(`${api}/dispositivos`);

    expect(res.status).toBe(200);

    expect(Array.isArray(res.data)).toBe(true);
  });

  test("GET /dispositivos/:id_dispositivo/id_monitorado - Buscar dispositivo por monitorado", async () => {
    const monitorado = await axios.post(`${api}/monitorados`, {
      nome: `Monitorado Disp ${Date.now()}`,
      idade: 8,
      nivel_tea: "2",
    });

    const dispositivo = await axios.post(`${api}/dispositivos`, {
      codigo: `DISP-${Date.now()}`,
      id_monitorado: monitorado.data.id_monitorado,
    });

    const res = await axios.get(
      `${api}/dispositivos/${dispositivo.data.id_dispositivo}/${monitorado.data.id_monitorado}`,
    );

    expect(res.status).toBe(200);
    expect(res.data.id_dispositivo).toBe(dispositivo.data.id_dispositivo);
    expect(res.data.id_monitorado).toBe(monitorado.data.id_monitorado);
  });

  test("PUT /dispositivos/:id - Atualizar dispositivo", async () => {
    const monitorado = await axios.post(`${api}/monitorados`, {
      nome: `Monitorado Update ${Date.now()}`,
      idade: 12,
      nivel_tea: "3",
    });

    const dispositivo = await axios.post(`${api}/dispositivos`, {
      codigo: `DISP-${Date.now()}`,
      id_monitorado: monitorado.data.id_monitorado,
    });

    const novoCodigo = `DISP-UPDATE-${Date.now()}`;

    const res = await axios.put(
      `${api}/dispositivos/${dispositivo.data.id_dispositivo}`,
      {
        codigo: novoCodigo,
      },
    );

    expect(res.status).toBe(200);

    expect(res.data.codigo).toBe(novoCodigo);
  });

  test("DELETE /dispositivos/:id - Deletar dispositivo", async () => {
    const monitorado = await axios.post(`${api}/monitorados`, {
      nome: `Monitorado Delete ${Date.now()}`,
      idade: 9,
      nivel_tea: "2",
    });

    const dispositivo = await axios.post(`${api}/dispositivos`, {
      codigo: `DISP-${Date.now()}`,
      id_monitorado: monitorado.data.id_monitorado,
    });

    const res = await axios.delete(
      `${api}/dispositivos/${dispositivo.data.id_dispositivo}`,
    );

    expect(res.status).toBe(204);
  });
});
