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

    it('should throw a 422 error for malformed json and invalidation parameters', async () => {
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

  describe('PATCH /api/v1/articles/:id', () => {
    it('should throw a 422 error for malformed json and invalid', async () => {
      const loginResponse = await request(server.serverExport)
        .post('/api/v1/auth/signin')
        .send({
          email: 'emmaldini12@gmail.com',
          password: 'qwerty',
        });
      const token = loginResponse.body.data.token;
      const response = await request(server.serverExport)
        .patch('/api/v1/articles/1')
        .set({ Authorization: 'jwt ' + token })
        .send({
          title: '',
          article: null,
        });
      expect(response.status).toBe(422);
      expect(response.body).toEqual(jasmine.objectContaining({
        status: 'error',
      }));
    });

    it('should send response of 201 for updating article', async () => {
      const loginResponse = await request(server.serverExport)
        .post('/api/v1/auth/signin')
        .send({
          email: 'emmaldini12@gmail.com',
          password: 'qwerty',
        });
      const token = loginResponse.body.data.token;
      const articleResponse = await request(server.serverExport)
        .post('/api/v1/articles')
        .set({ Authorization: 'jwt ' + token })
        .send({
          title: 'Hello Sports',
          article: 'Write on sports, its very cool',
        });

      const articleId = articleResponse.body.data.articleId;

      const response = await request(server.serverExport)
        .patch(`/api/v1/articles/${articleId}`)
        .set({ Authorization: 'jwt ' + token })
        .send({
          title: 'Hi Madam',
          article: 'lets talk wigs',
        });
      expect(response.status).toBe(200);
      expect(response.body).toEqual(jasmine.objectContaining({
        status: 'success',
      }));
    });

    it('should send response of 404 for article not found', async () => {
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
        .patch(`/api/v1/articles/5000`)
        .set({ Authorization: 'jwt ' + token })
        .send({
          title: 'Hi Madam',
          article: 'lets talk wigs',
        });
      expect(response.status).toBe(404);
      expect(response.body).toEqual(jasmine.objectContaining({
        status: 'error',
      }));
    });
  });

  describe('DELETE /api/v1/articles/:id', () => {

    it('should send response of 404 for article not found', async () => {
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
        .delete(`/api/v1/articles/5000`)
        .set({ Authorization: 'jwt ' + token });
      expect(response.status).toBe(404);
      expect(response.body).toEqual(jasmine.objectContaining({
        status: 'error',
      }));
    });

    it('should send response of 200 for deleting an article', async () => {
      const loginResponseDel = await request(server.serverExport)
        .post('/api/v1/auth/signin')
        .send({
          email: 'emmaldini12@gmail.com',
          password: 'qwerty',
        });
      const tokenToPost = loginResponseDel.body.data.token;
      const articleResponse = await request(server.serverExport)
        .post('/api/v1/articles')
        .set({ Authorization: 'jwt ' + tokenToPost })
        .send({
          title: 'Hello Entertainment',
          article: 'Write on Entertainment today, its very cool',
        });

      const articleId = articleResponse.body.data.articleId;

      const response = await request(server.serverExport)
        .delete(`/api/v1/articles/${articleId}`)
        .set({ Authorization: 'jwt ' + tokenToPost });
      expect(response.status).toBe(200);
      expect(response.body).toEqual(jasmine.objectContaining({
        status: 'success',
      }));
    });
  });

  describe('POST /api/v1/articles/:articleId/comment', () => {
    it('should throw a 422 error for empty comment', async () => {
      const loginResponse = await request(server.serverExport)
        .post('/api/v1/auth/signin')
        .send({
          email: 'emmaldini12@gmail.com',
          password: 'qwerty',
        });

      //create an article
      const token = loginResponse.body.data.token;
      const articleCreatedResponse = await request(server.serverExport)
        .post('/api/v1/articles')
        .set({ Authorization: 'jwt ' + token })
        .send({
          title: 'Hello Sports',
          article: 'Write on sports, its very cool',
        });
      const articleIdFromResponse = articleCreatedResponse.body.data.articleId;

      // Trying to paste a null comment
      const response = await request(server.serverExport)
        .post(`/api/v1/articles/${articleIdFromResponse}/comment`)
        .set({ Authorization: 'jwt ' + token })
        .send({
          comment: null,
        });
      expect(response.status).toBe(422);
      expect(response.body).toEqual(jasmine.objectContaining({
        status: 'error',
      }));
    });

    it('should throw a 404 error, article not found', async () => {
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
        .post(`/api/v1/articles/5000/comment`)
        .set({ Authorization: 'jwt ' + token })
        .send({
          comment: 'lets talk wigs',
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

      //create an article
      const token = loginResponse.body.data.token;
      const articleCreatedResponse = await request(server.serverExport)
        .post('/api/v1/articles')
        .set({ Authorization: 'jwt ' + token })
        .send({
          title: 'Hello Sports',
          article: 'Write on sports, its very cool',
        });
      const articleIdFromResponse = articleCreatedResponse.body.data.articleId;

      // Trying to paste a null comment
      const response = await request(server.serverExport)
        .post(`/api/v1/articles/${articleIdFromResponse}/comment`)
        .set({ Authorization: 'jwt ' + token })
        .send({
          comment: 'I will have to start with football',
        });
      expect(response.status).toBe(201);
      expect(response.body).toEqual(jasmine.objectContaining({
        status: 'success',
      }));
    });
  });
});
