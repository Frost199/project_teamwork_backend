const pg = require('pg');

describe('PostgreSQL failed connection', () => {
  //Connecting to database
  let conString = '1234';
  let client = new pg.Client(conString);
  let errOut = new Error(`could not connect to postgres`);

  it('should fail connecting', function () {
    client.connect((err) => {
      expect(err).toEqual(errOut);
    });
  });
});
