import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';

import config from '../config';
import v1Router from './routes';

const app = express();
const port = config.port;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('combined')); // logging

// Prefix all routes with /api
app.use('/api/v1', v1Router);

// Setup MongoDB connection
const options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
                  replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } } };
mongoose.connect(config.mongoUrl, options);

const mongoConn = mongoose.connection;
mongoConn.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Only start the app once the connection is established
mongoConn.once('open', () => {
  app.listen(port, () => console.log('✔ Express server listening on port %d in %s mode', port, app.get('env')));
});

export default app;
