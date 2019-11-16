const request = require('supertest');
const db = require('../../util/db_query');
const dotenv = require('dotenv');

dotenv.config();
let server;
let originalTimeout;
const fileToUpload = `${__dirname}/testFiles/one.gif`;
const fileForWrongFile = `${__dirname}/testFiles/test.txt`;

describe('Check if user can ', () => {
  beforeEach(() => {
    server = require('../../server');
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });

  afterEach(async () => {
    await server.serverExport.close();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    await db.query(`DELETE FROM Employee WHERE isAdmin=FALSE`);
  });

  describe('POST /api/v1/auth/signin', () => {

    it('should return a 422 for malformed requests', async () => {
      const res = await request(server.serverExport)
        .post('/api/v1/auth/signin')
        .send({
          email: 'test@mail',
          password: 'western',
        });
      expect(res.status).toBe(422);
      expect(res.body).toEqual(jasmine.objectContaining({
        status: 'error',
      }));
    });

    it('should return a 401 error and user not found', async () => {
      const res = await request(server.serverExport)
        .post('/api/v1/auth/signin')
        .send({
          email: 'test@mail.com',
          password: 'western',
        });
      expect(res.status).toBe(401);
      expect(res.body).toEqual(jasmine.objectContaining({
        status: 'error',
      }));
    });

    it('should return a 401 error and incorrect password', async () => {
      const res = await request(server.serverExport)
        .post('/api/v1/auth/signin')
        .send({
          email: 'emmaldini12@gmail.com',
          password: 'western',
        });
      expect(res.status).toBe(401);
      expect(res.body).toEqual(jasmine.objectContaining({
        status: 'error',
      }));
      expect(res.body).toEqual(jasmine.objectContaining({
        error: 'Incorrect password',
      }));
    });

    it('should return a 200 success for login user', async () => {
      const res = await request(server.serverExport)
        .post('/api/v1/auth/signin')
        .send({
          email: 'emmaldini12@gmail.com',
          password: 'qwerty',
        });
      expect(res.status).toBe(200);
      expect(res.body).toEqual(jasmine.objectContaining({
        status: 'success',
      }));
    });

    it('should return a 401 invalid user id for trying to make a gif', async () => {
      const loginResponse = await request(server.serverExport)
        .post('/api/v1/auth/signin')
        .send({
          email: 'emmaldini12@gmail.com',
          password: 'qwerty',
        });
      const token = loginResponse.body.data.token;
      const response = await request(server.serverExport)
        .post('/api/v1/gifs')
        .set({ Authorization: 'jwt ' + token + 'gggggg' })
        .field('title', 'meet the simpson')
        .attach('gif', fileToUpload);
      expect(response.status).toBe(401);
      expect(response.body).toEqual(jasmine.objectContaining({
        status: 'error',
      }));
    });

    it('should fail if file is not a gif', async () => {
      const loginResponse = await request(server.serverExport)
        .post('/api/v1/auth/signin')
        .send({
          email: 'emmaldini12@gmail.com',
          password: 'qwerty',
        });
      const token = loginResponse.body.data.token;
      const response = await request(server.serverExport)
        .post('/api/v1/gifs')
        .set({ Authorization: 'jwt ' + token })
        .field('title', 'meet the simpson')
        .attach('gif', fileForWrongFile);
      expect(response.status).toBe(400);
      expect(response.body).toEqual(jasmine.objectContaining({
        status: 'error',
      }));
    });

    it('should accept if file a gif', async () => {
      const loginResponse = await request(server.serverExport)
        .post('/api/v1/auth/signin')
        .send({
          email: 'emmaldini12@gmail.com',
          password: 'qwerty',
        });
      const token = loginResponse.body.data.token;
      const response = await request(server.serverExport)
        .post('/api/v1/gifs')
        .set({ Authorization: 'jwt ' + token })
        .field('title', 'meet the simpson')
        .attach('gif', fileToUpload);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(jasmine.objectContaining({
        status: 'success',
      }));
    });

    it('should fail if no file is sent', async () => {
      const loginResponse = await request(server.serverExport)
        .post('/api/v1/auth/signin')
        .send({
          email: 'emmaldini12@gmail.com',
          password: 'qwerty',
        });
      const token = loginResponse.body.data.token;
      const response = await request(server.serverExport)
        .post('/api/v1/gifs')
        .set({ Authorization: 'jwt ' + token })
        .field('title', 'meet the simpson');
      expect(response.status).toBe(400);
      expect(response.body).toEqual(jasmine.objectContaining({
        status: 'error',
      }));
      expect(response.body).toEqual(jasmine.objectContaining({
        error: 'File upload missing',
      }));
    });
  });
});
