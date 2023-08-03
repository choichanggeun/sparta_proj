const express = require('express');
const router = express.Router();

const postRouter = require('./posts.js');
const commentRouter = require('./comment.js');
const commentRouter = require('./users.js');

router.use('/users', userRouter);
router.use('/posts', postRouter);
router.use('/comments', commentRouter);

module.exports = router;
