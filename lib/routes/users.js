import express from 'express';

import User from '../models/user';

const router = express.Router(); // eslint-disable-line new-cap

// General User endpoints
// TODO: Confine to superuser
router.get('/', (req, res) => {
  User.find((err, users) => { // eslint-disable-line array-callback-return
    if (err) {
      res.json({ err });
    }

    res.json(users);
  });
});

router.post('/', (req, res) => {
  const baseUser = new User();
  const reqUser = req.body.user;
  const newUser = { ...baseUser, reqUser };

  newUser.save((err) => {
    if (err) {
      res.json({ err });
    }

    res.json({ message: 'User successfully created!', newUser });
  });
});

// Individual User endpoints

router.get('/:user_id', (req, res) => {
  User.findById(req.params.user_id, (err, user) => {
    if (err) {
      res.json({ err });
    }

    res.json(user);
  });
});

router.put('/:user_id', (req, res) => {
  User.findById(req.params.user_id, (findErr, user) => {
    if (findErr) {
      res.json({ findErr });
    }

    const { name = user.name,
            email = user.email,
            password = user.password } = req.body.play;
    const updatedUser = { ...user, name, email, password };

    updatedUser.save((updateErr) => {
      if (updateErr) {
        res.json({ updateErr });
      }

      res.json({ message: 'User successfully updated!', updatedUser });
    });
  });
});

router.delete('/:user_id', (req, res) => {
  User.remove({
    _id: req.params.user_id,
  }, (err, user) => {
    if (err) {
      res.json({ err });
    }

    res.json({ message: 'User successfully deleted!', user });
  });
});

export default router;
