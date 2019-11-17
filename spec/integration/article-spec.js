const request = require('supertest');
const db = require('../../util/db_query');
const dotenv = require('dotenv');

dotenv.config();
let server;
let originalTimeout;

describe('check if user can', () => {
  beforeEach(() => {
    server = require('../../server');
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });

  afterEach(async () => {
    await  server.serverExport.close();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    await db.query(`DELETE FROM Article`);
  });

  describe('POST /api/v1/articles', () => {
    it('should return a 200 response for creating an article', async () => {
      const loginResponse = await request(server.serverExport)
        .post('/api/v1/auth/signin')
        .send({
          email: 'emmaldini12@gmail.com',
          password: 'qwerty',
        });
      const token = loginResponse.body.data.token;
      const response = await request(server.serverExport)
        .post('/api/v1/articles')
        .set({ Authorization: 'jwt ' + token })
        .send({
          title: 'Hello Sports',
          article: 'Write on sports, its very cool',
        });
      expect(response.status).toBe(201);
      expect(response.body).toEqual(jasmine.objectContaining({
        status: 'success',
      }));
    });

    it('should throw a 422 error for malfiormed json and invalidation parameters', async () => {
      const loginResponse = await request(server.serverExport)
        .post('/api/v1/auth/signin')
        .send({
          email: 'emmaldini12@gmail.com',
          password: 'qwerty',
        });
      const token = loginResponse.body.data.token;
      const response = await request(server.serverExport)
        .post('/api/v1/articles')
        .set({ Authorization: 'jwt ' + token })
        .send({
          title: 'Hello Sports',
          article: null,
        });
      expect(response.status).toBe(422);
      expect(response.body).toEqual(jasmine.objectContaining({
        status: 'error',
      }));
    });
  });
});
