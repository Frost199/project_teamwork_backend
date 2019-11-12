const pg = require('pg');
const app = require('../../app');

describe('PostgreSQL failed connection', () => {
  //Connecting to database
  let conString = 'postgres://iopnxytv:gYVfD_df_4vqLi87UTx6u' +
    '8JPKz8jkhdF@salt.db.elephantsql.com:5432/1234';
  let client = new pg.Client(conString);

  it('should fail', function () {
    app.client = client.connect((err) => {
      if (err) {
        expect(err).toMatch(/does not exist/);
      }
    });
  });
});
