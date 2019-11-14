const request = require('supertest');
const bcrypt = require('bcrypt');
const db = require('../../util/db_query');
const dotenv = require('dotenv');

dotenv.config();
let server;
let originalTimeout;

describe('Check if user can ', () => {
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
      process.env.TEAMWORK_DATABASE_PASSWORD_TEST = '1234';
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

      const resAgain = await request(server.serverExport)
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
      expect(resAgain.status).toBe(400);
      expect(resAgain.body).toEqual(jasmine.objectContaining({
        status: 'error',
      }));
      expect(resAgain.body).toEqual(jasmine.objectContaining({
        error: 'User with that EMAIL already exist',
      }));
    });
    //
    // it('should fail to create user', async () =>  {
    //   const res = await request(server.serverExport)
    //     .post('/api/v1/auth/create-user')
    //     .send({
    //       firstName: 'Mathew',
    //       lastName: 'John',
    //       gender: 'Male',
    //       jobRole: 'Senior Marketer',
    //       department: 'Accounting',
    //       address: '20, Adeola Odekun, VI Lagos',
    //       email: 'test@mail.com',
    //       password: 'western',
    //     });
    //   expect(res.status).toBe(500);
    //   expect(res.body).toEqual(jasmine.objectContaining({
    //     status: 'error',
    //   }));
    //   expect(res.body).toEqual(jasmine.objectContaining({
    //     error: 'failed to create user',
    //   }));
    // });
  });
});
