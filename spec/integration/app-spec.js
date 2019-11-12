const request = require('supertest');
let server;

describe('/', () => {
  beforeEach(() => {
    server = require('../../server');
  });

  afterEach(async () => {
    await server.serverExport.close();
  });

  describe('GET /', () => {
    it('should return Hello, welcome', async () => {
      const res = await request(server.serverExport).get('/');
      expect(res.status).toBe(200);
    });
  });
});
