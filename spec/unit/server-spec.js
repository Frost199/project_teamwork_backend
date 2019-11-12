let server;

describe('normalizePort: ', () => {
  beforeEach(() => {
    server = require('../../server');
  });

  afterEach(async () => {
    await server.serverExport.close();
  });

  describe('portNormalize', () => {
    it('should should return input value if port is not a number', function () {
      let port = 'abc';
      let normalizedValue = server.portNormalized(port);
      expect(normalizedValue).toEqual(port);
    });

    it('should should return port number if port is greater than 0', function () {
      let intPort = 1000;
      let normalizedValueForInt = server.portNormalized(intPort);
      expect(normalizedValueForInt).toEqual(intPort);
    });

    it('should should return false for undefined states', function () {
      let normalizedValueForInt = server.portNormalized();
      expect(normalizedValueForInt).toBeFalsy();
    });
  });

});
