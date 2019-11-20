const request = require('supertest');
const db = require('../../util/db_query');
const dotenv = require('dotenv');

dotenv.config();
let server;
let originalTimeout;
const fileToUpload = `${__dirname}/testFiles/one.gif`;
const fileForWrongFile = `${__dirname}/testFiles/test.txt`;

describe('check if user can', () => {
  beforeEach(() => {
    server = require('../../server');
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });

  afterEach(async () => {
    await  server.serverExport.close();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    await db.query(`DELETE FROM Gif`);
  });

  describe('/api/v1/gifs/', () => {

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

    it('should send response of 404 for gif not found', async () => {
      const loginResponse = await request(server.serverExport)
        .post('/api/v1/auth/signin')
        .send({
          email: 'emmaldini12@gmail.com',
          password: 'qwerty',
        });
      const token = loginResponse.body.data.token;
      const response = await request(server.serverExport)
        .delete(`/api/v1/gifs/5000`)
        .set({ Authorization: 'jwt ' + token });
      expect(response.status).toBe(404);
      expect(response.body).toEqual(jasmine.objectContaining({
        status: 'error',
      }));
    });

    it('should send response of 200 for deleting a gif', async () => {
      const loginResponseForGif = await request(server.serverExport)
        .post('/api/v1/auth/signin')
        .send({
          email: 'emmaldini12@gmail.com',
          password: 'qwerty',
        });
      const token = loginResponseForGif.body.data.token;
      const gifPostResponse = await request(server.serverExport)
        .post('/api/v1/gifs')
        .set({ Authorization: 'jwt ' + token })
        .field('title', 'meet the simpson')
        .attach('gif', fileToUpload);

      const gifId = gifPostResponse.body.data.gifId;

      const response = await request(server.serverExport)
        .delete(`/api/v1/gifs/${gifId}`)
        .set({ Authorization: 'jwt ' + token });
      expect(response.status).toBe(200);
      expect(response.body).toEqual(jasmine.objectContaining({
        status: 'success',
      }));
    });
  });

  describe('POST /api/v1/gifs/:gifId/comment', () => {
    it('should throw a 422 error for empty comment', async () => {
      const loginResponse = await request(server.serverExport)
        .post('/api/v1/auth/signin')
        .send({
          email: 'emmaldini12@gmail.com',
          password: 'qwerty',
        });

      //create a gif
      const token = loginResponse.body.data.token;
      const gifCreatedResponse = await request(server.serverExport)
        .post('/api/v1/gifs')
        .set({ Authorization: 'jwt ' + token })
        .field('title', 'meet the simpson')
        .attach('gif', fileToUpload);
      const gifIdFromResponse = gifCreatedResponse.body.data.gifId;

      // Trying to paste a null comment
      const response = await request(server.serverExport)
        .post(`/api/v1/gifs/${gifIdFromResponse}/comment`)
        .set({ Authorization: 'jwt ' + token })
        .field('comment', '')
        .attach('gif', fileToUpload);
      expect(response.status).toBe(422);
      expect(response.body).toEqual(jasmine.objectContaining({
        status: 'error',
      }));
    });

    it('should throw a 404 error, gif not found', async () => {
      const loginResponse = await request(server.serverExport)
        .post('/api/v1/auth/signin')
        .send({
          email: 'emmaldini12@gmail.com',
          password: 'qwerty',
        });
      const token = loginResponse.body.data.token;

      await request(server.serverExport)
        .post('/api/v1/gifs')
        .set({ Authorization: 'jwt ' + token })
        .field('title', 'meet the simpson')
        .attach('gif', fileToUpload);

      const response = await request(server.serverExport)
        .post(`/api/v1/gifs/5000/comment`)
        .set({ Authorization: 'jwt ' + token })
        .send({
          comment: 'meet the simpson',
        });
      expect(response.status).toBe(404);
      expect(response.body).toEqual(jasmine.objectContaining({
        status: 'error',
      }));
    });

    it('should show a 201 for comment successfully added', async () => {
      const loginResponse = await request(server.serverExport)
        .post('/api/v1/auth/signin')
        .send({
          email: 'emmaldini12@gmail.com',
          password: 'qwerty',
        });

      //create a gif
      const token = loginResponse.body.data.token;
      const gifCreatedResponse = await request(server.serverExport)
        .post('/api/v1/gifs')
        .set({ Authorization: 'jwt ' + token })
        .field('title', 'meet the simpson')
        .attach('gif', fileToUpload);
      const gifIdFromResponse = gifCreatedResponse.body.data.gifId;

      // Trying to paste a comment
      const response = await request(server.serverExport)
        .post(`/api/v1/gifs/${gifIdFromResponse}/comment`)
        .set({ Authorization: 'jwt ' + token })
        .send({
          comment: 'The simpson\'s are always cool',
        });
      expect(response.status).toBe(201);
      expect(response.body).toEqual(jasmine.objectContaining({
        status: 'success',
      }));
    });
  });

  describe('GET /api/v1/gifs/:id',  () => {

    it('should throw a 404 error, gif not found', async () => {
      const loginResponse = await request(server.serverExport)
        .post('/api/v1/auth/signin')
        .send({
          email: 'emmaldini12@gmail.com',
          password: 'qwerty',
        });
      const token = loginResponse.body.data.token;
      const gifCreatedResponse = await request(server.serverExport)
        .post('/api/v1/gifs')
        .set({ Authorization: 'jwt ' + token })
        .field('title', 'meet the simpson')
        .attach('gif', fileToUpload);

      const gifIdFromResponse = gifCreatedResponse.body.data.gifId;

      const response = await request(server.serverExport)
        .get(`/api/v1/gifs/${parseInt(gifIdFromResponse) + 1}`)
        .set({ Authorization: 'jwt ' + token });
      expect(response.status).toBe(404);
      expect(response.body).toEqual(jasmine.objectContaining({
        status: 'error',
      }));
    });

    it('should return comments for a valid gif', async () => {
      const loginResponse = await request(server.serverExport)
        .post('/api/v1/auth/signin')
        .send({
          email: 'emmaldini12@gmail.com',
          password: 'qwerty',
        });

      //create a gif
      const token = loginResponse.body.data.token;
      const gifCreatedResponse = await request(server.serverExport)
        .post('/api/v1/gifs')
        .set({ Authorization: 'jwt ' + token })
        .field('title', 'meet the simpson')
        .attach('gif', fileToUpload);
      const gifIdFromResponse = gifCreatedResponse.body.data.gifId;

      // Trying to paste a comment
      await request(server.serverExport)
        .post(`/api/v1/gifs/${gifIdFromResponse}/comment`)
        .set({ Authorization: 'jwt ' + token })
        .send({
          comment: 'I will have to start with football',
        });

      // Fetch comment for the comment Id
      const gifResponseWithId = await request(server.serverExport)
        .get(`/api/v1/gifs/${gifIdFromResponse}`)
        .set({ Authorization: 'jwt ' + token });
      expect(gifResponseWithId.status).toBe(200);
      expect(gifResponseWithId.body).toEqual(jasmine.objectContaining({
        status: 'success',
      }));
    });

    it('should not return comments for a valid gif', async () => {
      const loginResponse = await request(server.serverExport)
        .post('/api/v1/auth/signin')
        .send({
          email: 'emmaldini12@gmail.com',
          password: 'qwerty',
        });

      //create a gif
      const token = loginResponse.body.data.token;
      const gifCreatedResponse = await request(server.serverExport)
        .post('/api/v1/gifs')
        .set({ Authorization: 'jwt ' + token })
        .field('title', 'meet the simpson')
        .attach('gif', fileToUpload);
      const gifIdFromResponse = gifCreatedResponse.body.data.gifId;

      // Fetch comment for the comment Id
      const gifResponseWithId = await request(server.serverExport)
        .get(`/api/v1/gifs/${gifIdFromResponse}`)
        .set({ Authorization: 'jwt ' + token });
      expect(gifResponseWithId.status).toBe(200);
      expect(gifResponseWithId.body).toEqual(jasmine.objectContaining({
        status: 'success',
      }));
    });
  });
});
