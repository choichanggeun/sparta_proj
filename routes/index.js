const express = require('express');
const router = express.Router();

const postsRouter = require('./posts.js');
const commentsRouter = require('./comment.js');
const usersRouter = require('./users.js');

router.use('/users', usersRouter);
router.use('/posts', postsRouter);
router.use('/comments', commentsRouter);

module.exports = router;
