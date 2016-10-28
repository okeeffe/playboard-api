import basicAuth from 'basic-auth';
import express from 'express';

import playsRouter from './routes/plays';
import usersRouter from './routes/users';

// MIDDLEWARE
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

// ROUTES
const router = express.Router(); // eslint-disable-line new-cap

// /
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Playboard API! You\'ll need an API key going forward.' });
});

router.post('/', auth, (req, res) => {
  const body = req.body;
  console.log(body);
  res.json({ message: `You sent ${body.test}` });
});

// /plays
router.use('/plays', auth, playsRouter);

// /users
// TODO: Work out how to pass the auth middleware around
router.use('/users', usersRouter);

export default router;
