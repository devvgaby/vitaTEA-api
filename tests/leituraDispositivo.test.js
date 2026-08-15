const axios = require("axios");
require("dotenv").config();

const api = `http://localhost:${process.env.PORT || 3000}`;

describe("Leitura Dispositivo", () => {
  test("POST /leituras_dispositivos - Criar leitura dispositivo", async () => {
    const monitorado = await axios.post(`${api}/monitorados`, {
      nome: `Monitorado Leitura ${Date.now()}`,
      idade: 12,
      nivel_tea: "3",
    });

    const dispositivo = await axios.post(`${api}/dispositivos`, {
      codigo: `DISP-${Date.now()}`,
      id_monitorado: monitorado.data.id_monitorado,
    });

    const tipoSinal = await axios.post(`${api}/tipo_sinais`, {
      nome: `Tipo Sinal ${Date.now()}`,
      unidade_medica: "bpm",
    });

    const dataHora = new Date();

    const res = await axios.post(`${api}/leituras_dispositivos`, {
      id_dispositivo: dispositivo.data.id_dispositivo,
      id_tipo_sinal: tipoSinal.data.id_tipo_sinal,
      valor: 85.5,
      data_hora: dataHora,
    });

    expect(res.status).toBe(201);

    expect(res.data).toHaveProperty("id_leitura_dispositivo");

    expect(res.data.id_dispositivo).toBe(dispositivo.data.id_dispositivo);

    expect(res.data.id_tipo_sinal).toBe(tipoSinal.data.id_tipo_sinal);

    expect(Number(res.data.valor)).toBe(85.5);

    expect(res.data).toHaveProperty("data_hora");
  });

  test("GET /leituras_dispositivos/:id - Buscar leitura dispositivo", async () => {
    const monitorado = await axios.post(`${api}/monitorados`, {
      nome: `Monitorado Busca ${Date.now()}`,
      idade: 10,
      nivel_tea: "2",
    });

    const dispositivo = await axios.post(`${api}/dispositivos`, {
      codigo: `DISP-${Date.now()}`,
      id_monitorado: monitorado.data.id_monitorado,
    });

    const tipoSinal = await axios.post(`${api}/tipo_sinais`, {
      nome: `Tipo Sinal Busca ${Date.now()}`,
      unidade_medica: "bpm",
    });

    const leitura = await axios.post(`${api}/leituras_dispositivos`, {
      id_dispositivo: dispositivo.data.id_dispositivo,
      id_tipo_sinal: tipoSinal.data.id_tipo_sinal,
      valor: 90.2,
      data_hora: new Date(),
    });

    const res = await axios.get(
      `${api}/leituras_dispositivos/${leitura.data.id_leitura_dispositivo}`,
    );

    expect(res.status).toBe(200);

    expect(res.data.id_leitura_dispositivo).toBe(
      leitura.data.id_leitura_dispositivo,
    );

    expect(Number(res.data.valor)).toBe(90.2);

    expect(res.data).toHaveProperty("data_hora");
  });

  test("GET /leituras_dispositivos/dispositivo/:id_dispositivo - Buscar leituras por dispositivo", async () => {
    const monitorado = await axios.post(`${api}/monitorados`, {
      nome: `Monitorado Dispositivo ${Date.now()}`,
      idade: 10,
      nivel_tea: "2",
    });

    const dispositivo = await axios.post(`${api}/dispositivos`, {
      codigo: `DISP-${Date.now()}`,
      id_monitorado: monitorado.data.id_monitorado,
    });

    const tipoSinal = await axios.post(`${api}/tipo_sinais`, {
      nome: `Tipo Sinal Disp ${Date.now()}`,
      unidade_medica: "bpm",
    });

    await axios.post(`${api}/leituras_dispositivos`, {
      id_dispositivo: dispositivo.data.id_dispositivo,
      id_tipo_sinal: tipoSinal.data.id_tipo_sinal,
      valor: 80.5,
      data_hora: new Date(),
    });

    await axios.post(`${api}/leituras_dispositivos`, {
      id_dispositivo: dispositivo.data.id_dispositivo,
      id_tipo_sinal: tipoSinal.data.id_tipo_sinal,
      valor: 92.1,
      data_hora: new Date(),
    });

    const res = await axios.get(
      `${api}/leituras_dispositivos/dispositivo/${dispositivo.data.id_dispositivo}`,
    );

    expect(res.status).toBe(200);

    expect(Array.isArray(res.data)).toBe(true);

    expect(res.data.length).toBeGreaterThan(0);

    expect(res.data[0].id_dispositivo).toBe(dispositivo.data.id_dispositivo);
  });

  test("GET /leituras_dispositivos - Listar leituras dispositivos", async () => {
    const res = await axios.get(`${api}/leituras_dispositivos`);

    expect(res.status).toBe(200);

    expect(Array.isArray(res.data)).toBe(true);
  });

  test("PUT /leituras_dispositivos/:id - Atualizar leitura dispositivo", async () => {
    const monitorado = await axios.post(`${api}/monitorados`, {
      nome: `Monitorado Update ${Date.now()}`,
      idade: 11,
      nivel_tea: "2",
    });

    const dispositivo = await axios.post(`${api}/dispositivos`, {
      codigo: `DISP-${Date.now()}`,
      id_monitorado: monitorado.data.id_monitorado,
    });

    const tipoSinal = await axios.post(`${api}/tipo_sinais`, {
      nome: `Tipo Sinal Update ${Date.now()}`,
      unidade_medica: "bpm",
    });

    const leitura = await axios.post(`${api}/leituras_dispositivos`, {
      id_dispositivo: dispositivo.data.id_dispositivo,
      id_tipo_sinal: tipoSinal.data.id_tipo_sinal,
      valor: 70.0,
      data_hora: new Date(),
    });

    const novaDataHora = new Date();

    const res = await axios.put(
      `${api}/leituras_dispositivos/${leitura.data.id_leitura_dispositivo}`,
      {
        valor: 95.8,
        data_hora: novaDataHora,
      },
    );

    expect(res.status).toBe(200);

    expect(Number(res.data.valor)).toBe(95.8);

    expect(res.data).toHaveProperty("data_hora");
  });

  test("DELETE /leituras_dispositivos/:id - Deletar leitura dispositivo", async () => {
    const monitorado = await axios.post(`${api}/monitorados`, {
      nome: `Monitorado Delete ${Date.now()}`,
      idade: 9,
      nivel_tea: "2",
    });

    const dispositivo = await axios.post(`${api}/dispositivos`, {
      codigo: `DISP-${Date.now()}`,
      id_monitorado: monitorado.data.id_monitorado,
    });

    const tipoSinal = await axios.post(`${api}/tipo_sinais`, {
      nome: `Tipo Sinal Delete ${Date.now()}`,
      unidade_medica: "bpm",
    });

    const leitura = await axios.post(`${api}/leituras_dispositivos`, {
      id_dispositivo: dispositivo.data.id_dispositivo,
      id_tipo_sinal: tipoSinal.data.id_tipo_sinal,
      valor: 88.4,
      data_hora: new Date(),
    });

    const res = await axios.delete(
      `${api}/leituras_dispositivos/${leitura.data.id_leitura_dispositivo}`,
    );

    expect(res.status).toBe(204);
  });
});
