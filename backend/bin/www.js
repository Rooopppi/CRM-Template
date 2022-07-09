import 'dotenv/config.js';
import http from 'http';
import { initApp } from '../src/App.js';

// const isDev = _.includes(['testing', 'development'], process.env.NODE_ENV);

const onListen = () => {
  console.log(`listening at port ${process.env.SERVER_PORT}`);
};

const main = async () => {
  const app = await initApp();
  const server = http.createServer(app);
  server.on('listening', () => onListen(server));
  // server.on('error', (error) => onError(error, server));
  server.listen(process.env.SERVER_PORT);
};

main();
