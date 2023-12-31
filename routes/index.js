const express = require('express');
const router = express.Router();

const postsRouter = require('./posts.js');
const commentsRouter = require('./comment.js');
const usersRouter = require('./users.js');
const likesRouter = require('./likes.js');

router.use('/users', usersRouter);
router.use('/posts', postsRouter);
router.use('/comments', commentsRouter);
router.use('/likes', likesRouter);

module.exports = router;
