const axios = require("axios");
require("dotenv").config();

const api = `http://localhost:${process.env.PORT || 3000}`;

describe("TipoSinal", () => {
  test("POST /tipos-sinais - Criar tipo de sinal vital", async () => {
    const res = await axios.post(`${api}/tipos-sinais`, {
      nome: "Frequência Cardíaca",
      unidade_medida: "bpm",
    });

    expect(res.status).toBe(201);

    expect(res.data).toHaveProperty("id_tipo_sinal");

    expect(res.data.nome).toBe("Frequência Cardíaca");

    expect(res.data.unidade_medida).toBe("bpm");
  });

  test("GET /tipos-sinais - Listar tipos de sinais", async () => {
    const res = await axios.get(`${api}/tipos-sinais`);

    expect(res.status).toBe(200);

    expect(Array.isArray(res.data)).toBe(true);
  });

  test("GET /tipos-sinais/:id - Buscar tipo de sinal por ID", async () => {
    const tipoSinal = await axios.post(`${api}/tipos-sinais`, {
      nome: `SpO2 ${Date.now()}`,
      unidade_medida: "%",
    });

    const res = await axios.get(
      `${api}/tipos-sinais/${tipoSinal.data.id_tipo_sinal}`,
    );

    expect(res.status).toBe(200);

    expect(res.data.id_tipo_sinal).toBe(tipoSinal.data.id_tipo_sinal);

    expect(res.data.nome).toBe(tipoSinal.data.nome);

    expect(res.data.unidade_medida).toBe("%");
  });

  test("PUT /tipos-sinais/:id - Atualizar tipo de sinal", async () => {
    const tipoSinal = await axios.post(`${api}/tipos-sinais`, {
      nome: "Temperatura",
      unidade_medida: "°C",
    });

    const res = await axios.put(
      `${api}/tipos-sinais/${tipoSinal.data.id_tipo_sinal}`,
      {
        nome: "Temperatura Corporal",
        unidade_medida: "°C",
      },
    );

    expect(res.status).toBe(200);

    expect(res.data.nome).toBe("Temperatura Corporal");

    expect(res.data.unidade_medida).toBe("°C");
  });

  test("DELETE /tipos-sinais/:id - Deletar tipo de sinal", async () => {
    const tipoSinal = await axios.post(`${api}/tipos-sinais`, {
      nome: `Pressão ${Date.now()}`,
      unidade_medida: "mmHg",
    });

    const res = await axios.delete(
      `${api}/tipos-sinais/${tipoSinal.data.id_tipo_sinal}`,
    );

    expect(res.status).toBe(204);
  });
});
