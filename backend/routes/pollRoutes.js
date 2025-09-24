const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/pollController');

router.post('/', ctrl.createPoll);
router.get('/', ctrl.getAllPolls);
router.get('/:id', ctrl.getPoll);
router.post('/:id/answer', ctrl.answerPoll);
router.post('/:id/close', ctrl.closePoll);

module.exports = router;
