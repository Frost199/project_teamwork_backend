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
    await server.serverExport.close();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    await db.query(`DELETE FROM Article`);
  });

  it('should return 200 for data not found in the database', async () => {
    const loginResponse = await request(server.serverExport)
      .post('/api/v1/auth/signin')
      .send({
        email: 'emmaldini12@gmail.com',
        password: 'qwerty',
      });
    const token = loginResponse.body.data.token;
    const response = await request(server.serverExport)
      .get('/api/v1/feed')
      .set({ Authorization: 'jwt ' + token });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(jasmine.objectContaining({
      status: 'success',
    }));
    expect(response.body).toEqual(jasmine.objectContaining({
      data: 'No Article/Gif found, kindly post one',
    }));
  });

  it('should return 200 for data retrieved', async () => {
    const loginResponse = await request(server.serverExport)
      .post('/api/v1/auth/signin')
      .send({
        email: 'emmaldini12@gmail.com',
        password: 'qwerty',
      });
    const token = loginResponse.body.data.token;
    await request(server.serverExport)
      .post('/api/v1/articles')
      .set({ Authorization: 'jwt ' + token })
      .send({
        title: 'Hello Sports',
        article: 'Write on sports, its very cool',
      });
    const response = await request(server.serverExport)
      .get('/api/v1/feed')
      .set({ Authorization: 'jwt ' + token });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(jasmine.objectContaining({
      status: 'success',
    }));
  });
});
