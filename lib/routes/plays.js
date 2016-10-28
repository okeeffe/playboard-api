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
  const basePlay = new Play();
  const reqPlay = req.body.play;
  const newPlay = { ...basePlay, reqPlay };

  // TODO: Get author ID from somewhere - req.user type middleware layer
  newPlay.save((err) => {
    if (err) {
      res.json({ err });
    }

    res.json({ message: 'Play successfully created!', newPlay });
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

    const { name = play.name,
            books = play.books,
            players = play.players,
            description = play.description,
            comments = play.comments } = req.body.play;
    const updatedPlay = { ...play, name, books, players, description, comments };

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
