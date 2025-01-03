import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import request from 'supertest';
import app from '../../app.js';

let server;
beforeEach(() => {
  const port = 3000;
  server = app.listen(port);
});

afterEach(() => {
  server.close();
});

describe('GET em /editoras', () => {
  it('Deve retornar uma lista de editoras.', async () => {
    const resposta = await request(app)
      .get('/editoras')
      .set('Accept', 'aplication/json')
      .expect('content-type', /json/)
      .expect(200);
    expect(resposta.body[0].email).toEqual('m@m.com');
  });
});

let idResposta;
describe('POST em /editoras', () => {
  it('Deve adicionar uma nova editora.', async () => {
    const resposta = await request(app)
      .post('/editoras')
      .send({
        nome: 'Antofágica',
        cidade: 'São Paulo',
        email: 'antofagica@g.com',
      })
      .expect(201);
    idResposta = resposta.body.content.id;
  });
  it('Não deve adicionar nada ao passar o body vazio', async () => {
    await request(app)
      .post('/editoras')
      .send({})
      .expect(400);
  });
});

describe('GET em /editoras/id', () => {
  it('Deve retornar recurso selecionado', async () => {
    await request(app)
      .get(`/editoras/${idResposta}`)
      .expect(200);
  });
});

describe('PUT em /editoras/id', () => {
  test.each([
    ['nome', { nome: 'Anto' }],
    ['cidade', { cidade: 'SP' }],
    ['email', { email: 'a@a.com' }],
  ])('Deve alterar o campo %s', async (chave, param) => {
    const requisicao = { request };
    const spy = jest.spyOn(requisicao, 'request');
    await requisicao.request(app)
      .put(`/editoras/${idResposta}`)
      .send(param)
      .expect(204);

    expect(spy).toHaveBeenCalled();
  });
});

describe('DELETE em /editoras/id', () => {
  it('Deve deletar a editora adicionada.', async () => {
    await request(app)
      .delete(`/editoras/${idResposta}`)
      .expect(200);
  });
});
