const axios = require("axios");
require("dotenv").config();

const api = `http://localhost:${process.env.PORT || 3000}`;

describe("Monitorados", () => {

  test("POST /monitorados - Criar monitorado", async () => {

    const nome = `João Silva ${Date.now()}`;

    const res = await axios.post(`${api}/monitorados`, {
      nome,
      idade: 10,
      nivel_tea: "2",
    });

    expect(res.status).toBe(201);

    expect(res.data).toHaveProperty("id_monitorado");
    expect(res.data.nome).toBe(nome);
    expect(res.data.idade).toBe(10);
    expect(res.data.nivel_tea).toBe("2");

    await axios.delete(
      `${api}/monitorados/${res.data.id_monitorado}`
    );
  });

  test("GET /monitorados - Listar monitorados", async () => {

    const res = await axios.get(`${api}/monitorados`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
  });

  test("GET /monitorados/:id - Obter monitorado por ID", async () => {

    const nome = `Maria Souza ${Date.now()}`;

    const criado = await axios.post(`${api}/monitorados`, {
      nome,
      idade: 9,
      nivel_tea: "2",
    });

    const id = criado.data.id_monitorado;

    const res = await axios.get(`${api}/monitorados/${id}`);

    expect(res.status).toBe(200);

    expect(res.data).toHaveProperty(
      "id_monitorado",
      id
    );

    expect(res.data.nome).toBe(nome);
    expect(res.data.idade).toBe(9);
    expect(res.data.nivel_tea).toBe("2");

    await axios.delete(`${api}/monitorados/${id}`);
  });

  test("PUT /monitorados/:id - Atualizar monitorado", async () => {

    const nome = `Lucas Oliveira ${Date.now()}`;
    const novoNome = `João da Silva ${Date.now()}`;

    const criado = await axios.post(`${api}/monitorados`, {
      nome,
      idade: 12,
      nivel_tea: "2",
    });

    const id = criado.data.id_monitorado;

    const res = await axios.put(`${api}/monitorados/${id}`, {
      nome: novoNome,
      idade: 11,
      nivel_tea: "3",
    });

    expect(res.status).toBe(200);

    expect(res.data).toHaveProperty(
      "id_monitorado",
      id
    );

    expect(res.data.nome).toBe(novoNome);
    expect(res.data.idade).toBe(11);
    expect(res.data.nivel_tea).toBe("3");

    await axios.delete(`${api}/monitorados/${id}`);
  });

  test("DELETE /monitorados/:id - Deletar monitorado", async () => {

    const nome = `Pedro Santos ${Date.now()}`;

    const criado = await axios.post(`${api}/monitorados`, {
      nome,
      idade: 8,
      nivel_tea: "2",
    });

    const id = criado.data.id_monitorado;

    const res = await axios.delete(`${api}/monitorados/${id}`);

    expect(res.status).toBe(204);

    await expect(
      axios.get(`${api}/monitorados/${id}`)
    ).rejects.toThrow();
  });

});