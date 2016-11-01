import express from 'express';

import { auth } from './middleware';
import playsRouter from './routes/plays';
import usersRouter from './routes/users';

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
