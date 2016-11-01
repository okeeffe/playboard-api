import express from 'express';

import { unauthorized, auth, superuser } from '../middleware';
import User from '../models/user';

const router = express.Router(); // eslint-disable-line new-cap

// General User endpoints

router.get('/', superuser, (req, res) => {
  User.find((err, users) => { // eslint-disable-line array-callback-return
    if (err) {
      res.json({ err });
    }

    res.json(users);
  });
});

router.post('/', (req, res) => {
  if (req.body.user) {
    const newUser = new User();
    const reqUser = req.body.user;

    newUser.name = reqUser.name;
    newUser.email = reqUser.email;
    newUser.password = reqUser.password;
    newUser.super = false;

    newUser.save((err) => {
      if (err) {
        res.json({ err });
      }

      res.json({ message: 'User successfully created!', newUser });
    });
  } else {
    return res.status(400)
              .json({ code: 400, message: 'The request must contain a user object.' });
  }
});

// Individual User endpoints

router.get('/:user_id', auth, (req, res) => {
  User.findById(req.params.user_id, (err, user) => {
    if (err) {
      res.json({ err });
    }

    res.json(user);
  });
});

router.put('/:user_id', auth, (req, res) => {
  if (req.user.id === req.params.user_id || req.user.super) {
    User.findById(req.params.user_id, (findErr, user) => {
      if (findErr) {
        res.json({ findErr });
      }

      // fallback to defaults from found user
      const { name = user.name,
              email = user.email,
              password = user.password } = req.body.user;

      const updatedUser = user;
      updatedUser.name = name;
      updatedUser.email = email;
      updatedUser.password = password;

      updatedUser.save((updateErr) => {
        if (updateErr) {
          res.json({ updateErr });
        }

        res.json({ message: 'User successfully updated!', updatedUser });
      });
    });
  } else {
    return unauthorized(res);
  }
});

router.delete('/:user_id', auth, (req, res) => {
  if (req.user.id === req.params.user_id || req.user.super) {
    User.remove({
      _id: req.params.user_id,
    }, (err, user) => {
      if (err) {
        res.json({ err });
      }

      res.json({ message: 'User successfully deleted!', user });
    });
  } else {
    return unauthorized(res);
  }
});

export default router;
