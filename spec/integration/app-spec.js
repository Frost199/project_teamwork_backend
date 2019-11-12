const request = require('supertest');
let server;

describe('/', () => {
  beforeEach(() => {
    server = require('../../server');
  });

  afterEach(async () => {
    await server.close();
  });

  describe('GET /', () => {
    it('should return Hello, welcome', async () => {
      const res = await request(server).get('/');
      expect(res.status).toBe(200);
    });
  });
});
