const pg = require('pg');
const app = require('../../app');

describe('PostgreSQL failed connection', () => {
  //Connecting to database
  let conString = '1234';
  let client = new pg.Client(conString);
  let errOut = new Error(`could not connect to postgres`);

  it('should fail', function () {
    app.client = client.connect((err) => {
      if (err) {
        expect(err).toEqual(errOut);
      }
    });
  });
});
