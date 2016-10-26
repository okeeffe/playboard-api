import basicAuth from 'basic-auth';
import bodyParser from 'body-parser';
import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import morgan from 'morgan';

import config from '../config';
import Play from './models/play';
import User from './models/user';

const app = express();
const port = config.port;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('combined')); // logging

mongoose.connect(config.mongoUrl);

// Somewhat hacky basic auth checking
const auth = (req, res, next) => {
  const unauthorized = () => {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.status(403).json({ code: 403, message: 'You don\'t have authorization!' });
  };

  const user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized();
  }

  if (user.name === 'foo' && user.pass === 'bar') {
    return next();
  }

  return unauthorized();
};

// Set up routes
const router = express.Router(); // eslint-disable-line new-cap

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Playboard API! You\'ll need an API key going forward.' });
});

router.post('/', auth, (req, res) => {
  const body = req.body;
  console.log(body);
  res.json({ message: `You sent ${body.test}` });
});

router.route('/plays')
  .post = (req, res) => {
    const play = new Play();
    play.name = req.body.name;

    play.save = (err) => {
      if (err) {
        res.json({ err });
      }

      res.json({ message: 'Play successfully created!', play });
    };
  };

// Prefix all routes with /api
app.use('/api', router);

app.listen(port, () => console.log('✔ Express server listening on port %d in %s mode', port, app.get('env')));

module.exports = app;
