const http = require('http');
const app = require('./app');

//normalizePort function returns a valid port, whether it is provided as a number or a string
const normalizePort = val => {
  const port = parseInt(val, 10);
  if (isNaN(port)) { return val; }

  if (port > 0) { return port; }

  return false;
};

//normalize and set the port
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/* errorHandler function, checks for various errors while running the server
and handles them appropriately */
const errorHandler = error => {
  if (error.syscall !== 'listen') { throw error; }

  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe' + address : 'port: ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// create a http server
const server = http.createServer(app);

// Emitters
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe' + address : 'port: ' + port;
  console.log('Listening on ' + bind);
});

// Listening on port
const serverExport = server.listen(port);

// Export the server module
module.exports = serverExport;
