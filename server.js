// import http from 'http';
const http = require ('http')
// import app from './app'
const app = require ('./app');

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server started on ${port}`);
  });
  