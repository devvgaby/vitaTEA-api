const axios = require("axios");
require("dotenv").config();

const api = `http://localhost:${process.env.PORT || 3000}`;

describe("Contatos de Emergência", () => {

  test("POST /contatos-emergencia - Criar contato", async () => {

    const nomeMonitorado = `João ${Date.now()}`;

    const monitorado = await axios.post(`${api}/monitorados`, {
      nome: nomeMonitorado,
      idade: 10,
      nivel_tea: "2",
    });

    const id_monitorado = monitorado.data.id_monitorado;

    const res = await axios.post(`${api}/contatos-emergencia`, {
      nome: "Maria Souza",
      telefone: "41999999999",
      parentesco: "Mãe",
      id_monitorado,
    });

    expect(res.status).toBe(201);

    expect(res.data).toHaveProperty("id_contato_emergencia");
    expect(res.data.nome).toBe("Maria Souza");
    expect(res.data.telefone).toBe("41999999999");
    expect(res.data.parentesco).toBe("Mãe");
    expect(res.data.id_monitorado).toBe(id_monitorado);

    await axios.delete(
      `${api}/contatos-emergencia/${res.data.id_contato_emergencia}`
    );

    await axios.delete(
      `${api}/monitorados/${id_monitorado}`
    );
  });

  test("GET /contatos-emergencia - Listar contatos", async () => {

    const res = await axios.get(`${api}/contatos-emergencia`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
  });

  test("GET /contatos-emergencia/:id - Obter contato por ID", async () => {

    const nomeMonitorado = `Maria ${Date.now()}`;

    const monitorado = await axios.post(`${api}/monitorados`, {
      nome: nomeMonitorado,
      idade: 9,
      nivel_tea: "1",
    });

    const id_monitorado = monitorado.data.id_monitorado;

    const criado = await axios.post(`${api}/contatos-emergencia`, {
      nome: "Carlos Souza",
      telefone: "41988888888",
      parentesco: "Pai",
      id_monitorado,
    });

    const id = criado.data.id_contato_emergencia;

    const res = await axios.get(
      `${api}/contatos-emergencia/${id}`
    );

    expect(res.status).toBe(200);

    expect(res.data).toHaveProperty(
      "id_contato_emergencia",
      id
    );

    expect(res.data.nome).toBe("Carlos Souza");
    expect(res.data.telefone).toBe("41988888888");
    expect(res.data.parentesco).toBe("Pai");

    await axios.delete(
      `${api}/contatos-emergencia/${id}`
    );

    await axios.delete(
      `${api}/monitorados/${id_monitorado}`
    );
  });

  test("PUT /contatos-emergencia/:id - Atualizar contato", async () => {

    const nomeMonitorado = `Pedro ${Date.now()}`;

    const monitorado = await axios.post(`${api}/monitorados`, {
      nome: nomeMonitorado,
      idade: 8,
      nivel_tea: "3",
    });

    const id_monitorado = monitorado.data.id_monitorado;

    const criado = await axios.post(`${api}/contatos-emergencia`, {
      nome: "Ana Souza",
      telefone: "41977777777",
      parentesco: "Tia",
      id_monitorado,
    });

    const id = criado.data.id_contato_emergencia;

    const res = await axios.put(
      `${api}/contatos-emergencia/${id}`,
      {
        nome: "Ana Oliveira",
        telefone: "41966666666",
        parentesco: "Avó",
        id_monitorado,
      }
    );

    expect(res.status).toBe(200);

    expect(res.data).toHaveProperty(
      "id_contato_emergencia",
      id
    );

    expect(res.data.nome).toBe("Ana Oliveira");
    expect(res.data.telefone).toBe("41966666666");
    expect(res.data.parentesco).toBe("Avó");

    await axios.delete(
      `${api}/contatos-emergencia/${id}`
    );

    await axios.delete(
      `${api}/monitorados/${id_monitorado}`
    );
  });

  test("DELETE /contatos-emergencia/:id - Deletar contato", async () => {

    const nomeMonitorado = `Lucas ${Date.now()}`;

    const monitorado = await axios.post(`${api}/monitorados`, {
      nome: nomeMonitorado,
      idade: 11,
      nivel_tea: "2",
    });

    const id_monitorado = monitorado.data.id_monitorado;

    const criado = await axios.post(`${api}/contatos-emergencia`, {
      nome: "Fernanda Lima",
      telefone: "41955555555",
      parentesco: "Irmã",
      id_monitorado,
    });

    const id = criado.data.id_contato_emergencia;

    const res = await axios.delete(
      `${api}/contatos-emergencia/${id}`
    );

    expect(res.status).toBe(204);

    await expect(
      axios.get(`${api}/contatos-emergencia/${id}`)
    ).rejects.toThrow();

    await axios.delete(
      `${api}/monitorados/${id_monitorado}`
    );
  });

});