import express from 'express';

import { auth } from './middleware';
import User, { allUserPropsMongoStr } from './models/user';
import playsRouter from './routes/plays';
import usersRouter from './routes/users';

// ROUTES
const router = express.Router(); // eslint-disable-line new-cap

// /
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Playboard API! You\'ll need an API key going forward. Sign up to get one!' });
});

router.post('/', auth, (req, res) => {
  res.json({ message: `You sent "${req.body.message}" as user with ID ${req.user.id} and fullname ${req.user.name.full}` });
});

// /login
router.post('/login', (req, res) => {
  console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }, `${allUserPropsMongoStr}`, (findErr, user) => {
    if (findErr || !user) {
      return res.status(404   )
              .json({ code: 404, message: 'No user with that email address.' });
    }

    user.comparePassword(password, (compErr, isMatch) => {
      if (compErr || !isMatch) {
        return res.status(403)
              .json({ code: 403, message: 'Incorrect password.' });
      }

      // Can't do this purely due to Mongoose problems
      // This means that lastLoggedInAt will always be just now - fine for admin
      const userForSaving = user;
      userForSaving.lastLoggedInAt = Date.now();
      userForSaving.numLogins += 1;

      userForSaving.save((saveErr) => {
        if (saveErr) {
          console.log(saveErr);
        }
      });

      const sanitisedUser = user.toObject();
      delete sanitisedUser.password;

      res.json({ message: 'Logged in successfully!', user: sanitisedUser });
    });
  });
});

// /plays
router.use('/plays', auth, playsRouter);

// /users
// TODO: Work out how to pass the auth middleware around
router.use('/users', usersRouter);

export default router;
