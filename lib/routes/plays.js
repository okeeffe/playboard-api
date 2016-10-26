import express from 'express';

import Play from '../models/play';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/', (req, res) => {
  Play.find((err, plays) => { // eslint-disable-line array-callback-return
    if (err) {
      res.json({ err });
    }

    res.json(plays);
  });
});

router.post('/', (req, res) => {
  const play = new Play();
  play.name = req.body.name;

  play.save((err) => {
    if (err) {
      res.json({ err });
    }

    res.json({ message: 'Play successfully created!', play });
  });
});

export default router;
