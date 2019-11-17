const request = require('supertest');
const bcrypt = require('bcrypt');
const db = require('../../util/db_query');
const dotenv = require('dotenv');

dotenv.config();
let server;
let originalTimeout;

describe('Check if Admin can ', () => {
  beforeEach(() => {
    server = require('../../server');
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });

  afterEach(async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    await server.serverExport.close();
    await db.query(`DELETE FROM Employee WHERE isAdmin=FALSE`);
  });

  describe('POST /api/v1/auth/create-user', () => {

    it('should return hashed password', async () => {
      const loginResponse = await request(server.serverExport)
        .post('/api/v1/auth/signin')
        .send({
          email: 'emmaldini12@gmail.com',
          password: 'qwerty',
        });
      const token = loginResponse.body.data.token;
      await request(server.serverExport)
        .post('/api/v1/auth/create-user')
        .set({ Authorization: 'jwt ' + token })
        .send({
          email: 'test@mail.com',
          password: 'western',
        });
      bcrypt.hash('western', 10)
        .then((value => expect(value).not.toBeNaN()));
    });

    it('should prevent unauthorized users', async () => {

      //Admin Logs in
      const adminResponse = await request(server.serverExport)
        .post('/api/v1/auth/signin')
        .send({
          email: 'emmaldini12@gmail.com',
          password: 'qwerty',
        });
      const adminToken = adminResponse.body.data.token;

      //Admin creates a user
      await request(server.serverExport)
        .post('/api/v1/auth/create-user')
        .set({ Authorization: 'jwt ' + adminToken })
        .send({
          firstName: 'Mathew',
          lastName: 'John',
          gender: 'Male',
          jobRole: 'Senior Marketer',
          department: 'Accounting',
          address: '20, Adeola Odekun, VI Lagos',
          email: 'test@mail.com',
          password: 'western',
        });

      //created user logs in
      const loginResponse = await request(server.serverExport)
        .post('/api/v1/auth/signin')
        .send({
          email: 'test@mail.com',
          password: 'western',
        });
      const token = loginResponse.body.data.token;

      // Created user wants to create a new user
      const response = await request(server.serverExport)
        .post('/api/v1/auth/create-user')
        .set({ Authorization: 'jwt ' + token })
        .send({
          firstName: 'Mathew',
          lastName: 'John',
          gender: 'Male',
          jobRole: 'Senior Marketer',
          department: 'Accounting',
          address: '20, Adeola Odekun, VI Lagos',
          email: 'test@mail.com',
          password: 'western',
        });
      expect(response.status).toBe(401);
      expect(response.body).toEqual(jasmine.objectContaining({
        error: 'Unauthorized User',
      }));
    });

    it('should return an invalid request', async () => {
      const loginResponse = await request(server.serverExport)
        .post('/api/v1/auth/signin')
        .send({
          email: 'emmaldini12@gmail.com',
          password: 'qwerty',
        });
      const jwtToken = loginResponse.body.data.token;
      const response = await request(server.serverExport)
        .post('/api/v1/auth/create-user')
        .set({ Authorization: 'jwt ' + jwtToken + 'modifiedToken' })
        .send({
          email: 'test@mail.com',
          password: 'western',
        });
      expect(response.status).toBe(401);
      expect(response.body).toEqual(jasmine.objectContaining({
        error: 'Invalid request',
      }));
    });

    it('should return success for creating user', async () => {
      const loginResponse = await request(server.serverExport)
        .post('/api/v1/auth/signin')
        .send({
          email: 'emmaldini12@gmail.com',
          password: 'qwerty',
        });
      const token = loginResponse.body.data.token;
      const res = await request(server.serverExport)
        .post('/api/v1/auth/create-user')
        .set({ Authorization: 'jwt ' + token })
        .send({
          firstName: 'Mathew',
          lastName: 'John',
          gender: 'Male',
          jobRole: 'Senior Marketer',
          department: 'Accounting',
          address: '20, Adeola Odekun, VI Lagos',
          email: 'test@mail.com',
          password: 'western',
        });
      expect(res.status).toBe(201);
      expect(res.body).toEqual(jasmine.objectContaining({
        status: 'success',
      }));
    });

    it('should show error user email already exists', async () => {

      const loginResponse = await request(server.serverExport)
        .post('/api/v1/auth/signin')
        .send({
          email: 'emmaldini12@gmail.com',
          password: 'qwerty',
        });
      const token = loginResponse.body.data.token;
      await request(server.serverExport)
        .post('/api/v1/auth/create-user')
        .set({ Authorization: 'jwt ' + token })
        .send({
          firstName: 'Mathew',
          lastName: 'John',
          gender: 'Male',
          jobRole: 'Senior Marketer',
          department: 'Accounting',
          address: '20, Adeola Odekun, VI Lagos',
          email: 'test@mail.com',
          password: 'western',
        });
      const resAgain = await request(server.serverExport)
        .post('/api/v1/auth/create-user')
        .set({ Authorization: 'jwt ' + token })
        .send({
          firstName: 'Mathew',
          lastName: 'John',
          gender: 'Male',
          jobRole: 'Senior Marketer',
          department: 'Accounting',
          address: '20, Adeola Odekun, VI Lagos',
          email: 'test@mail.com',
          password: 'western',
        });
      expect(resAgain.status).toBe(400);
      expect(resAgain.body).toEqual(jasmine.objectContaining({
        status: 'error',
      }));
      expect(resAgain.body).toEqual(jasmine.objectContaining({
        error: 'User with that EMAIL already exist',
      }));
    });
  });
});
