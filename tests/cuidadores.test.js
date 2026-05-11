const axios = require("axios");
require("dotenv").config();

const api = `http://localhost:${process.env.PORT || 3000}`;

describe("Cuidadores", () => {

  test("POST /cuidadores - Criar cuidador", async () => {

    const email = `maria${Date.now()}@example.com`;

    const res = await axios.post(`${api}/cuidadores`, {
      nome: "Maria Silva",
      email,
      senha: "senha123",
    });

    expect(res.status).toBe(201);

    expect(res.data).toHaveProperty("id_cuidador");
    expect(res.data.nome).toBe("Maria Silva");
    expect(res.data.email).toBe(email);

    expect(res.data).not.toHaveProperty("senha");

    await axios.delete(
      `${api}/cuidadores/${res.data.id_cuidador}`
    );
  });

  test("GET /cuidadores - Listar cuidadores", async () => {

    const res = await axios.get(`${api}/cuidadores`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
  });

  test("GET /cuidadores/:id - Obter cuidador por ID", async () => {

    const email = `joao${Date.now()}@example.com`;

    const criado = await axios.post(`${api}/cuidadores`, {
      nome: "João Pedro",
      email,
      senha: "123456",
    });

    const id = criado.data.id_cuidador;

    const res = await axios.get(`${api}/cuidadores/${id}`);

    expect(res.status).toBe(200);

    expect(res.data).toHaveProperty(
      "id_cuidador",
      id
    );

    expect(res.data.nome).toBe("João Pedro");
    expect(res.data.email).toBe(email);

    expect(res.data).not.toHaveProperty("senha");

    await axios.delete(`${api}/cuidadores/${id}`);
  });

  test("PUT /cuidadores/:id - Atualizar cuidador", async () => {

    const email = `maria${Date.now()}@example.com`;
    const novoEmail = `maria.camargo${Date.now()}@example.com`;

    const criado = await axios.post(`${api}/cuidadores`, {
      nome: "Maria Silva",
      email,
      senha: "123456",
    });

    const id = criado.data.id_cuidador;

    const res = await axios.put(`${api}/cuidadores/${id}`, {
      nome: "Maria Silva Camargo",
      email: novoEmail,
      senha: "senha1234",
    });

    expect(res.status).toBe(200);

    expect(res.data).toHaveProperty(
      "id_cuidador",
      id
    );

    expect(res.data.nome).toBe("Maria Silva Camargo");
    expect(res.data.email).toBe(novoEmail);

    expect(res.data).not.toHaveProperty("senha");

    await axios.delete(`${api}/cuidadores/${id}`);
  });

  test("DELETE /cuidadores/:id - Deletar cuidador", async () => {

    const email = `carlos${Date.now()}@example.com`;

    const criado = await axios.post(`${api}/cuidadores`, {
      nome: "Carlos Souza",
      email,
      senha: "123456",
    });

    const id = criado.data.id_cuidador;

    const res = await axios.delete(`${api}/cuidadores/${id}`);

    expect(res.status).toBe(204);

    await expect(
      axios.get(`${api}/cuidadores/${id}`)
    ).rejects.toThrow();
  });

});