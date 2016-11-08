import express from 'express';

import { unauthorized } from '../middleware';
import Play from '../models/play';

const router = express.Router(); // eslint-disable-line new-cap

// General Play endpoints

router.get('/', (req, res) => {
  Play.find({ authors: req.user.id }, (err, plays) => { // eslint-disable-line array-callback-return
    if (err) {
      res.json({ err });
    }

    const retPlays = plays.map(play => play.toObject());
    res.json({ plays: retPlays });
  });
});

router.post('/', (req, res) => {
  if (req.body.play) {
    const newPlay = new Play();
    const reqPlay = req.body.play;

    // combine and de-duplicate (overkill but for later use)
    const authors = [...new Set(reqPlay.authors.concat(req.user.id))];

    // Can't use beautiful spread syntax of ES6 because Mongoose
    newPlay.name = reqPlay.name;
    newPlay.description = reqPlay.description;
    newPlay.public = reqPlay.public;
    newPlay.authors = authors;

    newPlay.save((err) => {
      if (err) {
        res.json({ err });
      }

      res.json({ message: 'Play successfully created!', play: newPlay.toObject() });
    });
  } else {
    return res.status(400)
              .json({ code: 400, message: 'The request must contain a play object.' });
  }
});

// Individual Play endpoints

router.get('/:play_id', (req, res) => {
  Play.findById(req.params.play_id, (err, play) => {
    if (err) {
      return res.status(404)
              .json({ code: 404, message: 'That play does not exist.' });
    }

    if (play.authors.includes(req.user.id) || play.public) {
      res.json({ play: play.toObject() });
    } else {
      return unauthorized(res);
    }
  });
});

router.put('/:play_id', (req, res) => {
  Play.findById(req.params.play_id, (findErr, play) => {
    if (findErr) {
      return res.status(404)
              .json({ code: 404, message: 'That play does not exist.' });
    }

    if (play.authors.includes(req.user.id)) {
      if (req.body.play) {
        const reqPlay = req.body.play;
        const { name = play.name,
                books = play.books,
                players = play.players,
                description = play.description,
                comments = play.comments } = reqPlay;

        const updatedPlay = play;
        updatedPlay.name = name;
        updatedPlay.books = books;
        updatedPlay.players = players;
        updatedPlay.description = description;
        updatedPlay.comments = comments;

        updatedPlay.save((updateErr) => {
          if (updateErr) {
            res.json({ updateErr });
          }

          res.json({ message: 'Play successfully updated!', play: updatedPlay.toObject() });
        });
      } else {
        return res.status(400)
                .json({ code: 400, message: 'The request must contain a play object.' });
      }
    } else {
      return unauthorized(res);
    }
  });
});

router.delete('/:play_id', (req, res) => {
  Play.findById(req.params.play_id, (findErr, play) => {
    if (findErr) {
      return res.status(404)
              .json({ code: 404, message: 'That play does not exist.' });
    }

    if (play.authors.includes(req.user.id)) {
      Play.remove({
        _id: req.params.play_id,
      }, (remErr, removedPlay) => {
        if (remErr) {
          res.json({ remErr });
        }

        res.json({ message: 'Play successfully deleted!', play: removedPlay.toObject() });
      });
    } else {
      return unauthorized(res);
    }
  });
});

export default router;
