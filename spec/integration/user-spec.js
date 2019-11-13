const request = require('supertest');
const bcrypt = require('bcrypt');
const db = require('../../util/db_query');
let server;

describe('/', () => {
  beforeEach(() => {
    server = require('../../server');
  });

  // afterEach(async () => {
  //   await server.serverExport.close();
  // });

  afterAll(async () => {
    await server.serverExport.close();
    const connection  = `DELETE FROM Employee`;
    await db.query(connection);
  });

  describe('POST /api/v1/auth/create-user', () => {
    it('should return error and message for invalid email', async () => {
      const res = await request(server.serverExport)
        .post('/api/v1/auth/create-user')
        .send({
          email: 'test@mail',
        });
      expect(res.body).toEqual(jasmine.objectContaining({
        error: 'Please enter a valid email address',
      }));
      expect(res.body).toEqual(jasmine.objectContaining({
        status: 'error',
      }));
    });

    it('should return hashed password', async () => {
      await request(server.serverExport)
        .post('/api/v1/auth/create-user')
        .send({
          email: 'test@mail.com',
          password: 'western',
        });
      bcrypt.hash('western', 10)
        .then((value => expect(value).not.toBeNaN()));
    });

    it('should return success for creating user', async () => {
      const res = await request(server.serverExport)
        .post('/api/v1/auth/create-user')
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

    it('should return error for duplicate mail', async () => {
      const res = await request(server.serverExport)
        .post('/api/v1/auth/create-user')
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
      expect(res.status).toBe(400);
      expect(res.body).toEqual(jasmine.objectContaining({
        status: 'error',
      }));
      expect(res.body).toEqual(jasmine.objectContaining({
        error: 'User with that EMAIL already exist',
      }));
    });
  });
});
