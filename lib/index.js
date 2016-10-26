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

mongoose.connect(config.mongoUrl);

// Prefix all routes with /api
app.use('/api/v1', v1Router);

app.listen(port, () => console.log('✔ Express server listening on port %d in %s mode', port, app.get('env')));

export default app;
