import express from 'express';

import Play from '../models/play';

const router = express.Router(); // eslint-disable-line new-cap

// General Play endpoints

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

// Individual Play endpoints

router.get('/:play_id', (req, res) => {
  Play.findById(req.params.play_id, (err, play) => {
    if (err) {
      res.json({ err });
    }

    res.json(play);
  });
});

router.put('/:play_id', (req, res) => {
  Play.findById(req.params.play_id, (findErr, play) => {
    if (findErr) {
      res.json({ findErr });
    }

    const name = req.body.name;
    const updatedPlay = { ...play, name };

    updatedPlay.save((updateErr) => {
      if (updateErr) {
        res.json({ updateErr });
      }

      res.json({ message: 'Play successfully updated!', updatedPlay });
    });
  });
});

router.delete('/:play_id', (req, res) => {
  Play.remove({
    _id: req.params.play_id,
  }, (err, play) => {
    if (err) {
      res.json({ err });
    }

    res.json({ message: 'Play successfully deleted!', play });
  });
});

export default router;
