import express from 'express';

import { auth } from './middleware';
import User, { allUserPropsForAuth } from './models/user';
import playsRouter from './routes/plays';
import usersRouter from './routes/users';

// ROUTES
const router = express.Router(); // eslint-disable-line new-cap

// /
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Playboard API! You\'ll need an API key going forward. Sign up to get one!' });
});

router.post('/', auth, (req, res) => {
  res.json({ message: `You sent "${req.body.message}" as user with ID ${req.user.id} and fullname ${req.user.fullname}` });
});

// /login
router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Need to explicitly include the password in this
  User.findOne({ email }, `${allUserPropsForAuth} +password`, (err, user) => {
    if (err) {
      return res.status(404)
              .json({ code: 404, message: 'No user with that email address.' });
    }

    console.log(user);
    user.comparePassword(password, (compErr, isMatch) => {
      if (compErr || !isMatch) {
        return res.status(403)
              .json({ code: 403, message: 'Incorrect password.' });
      }

      const sanitisedUser = user.toObject();
      delete sanitisedUser.password;

      res.json({ message: 'Logged in successfully!', sanitisedUser });
    });
  });
});

// /plays
router.use('/plays', auth, playsRouter);

// /users
// TODO: Work out how to pass the auth middleware around
router.use('/users', usersRouter);

export default router;
