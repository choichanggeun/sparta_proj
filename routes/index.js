const express = require("express");
const router = express.Router();

const postRouter = require("./posts.js");
const commentRouter = require("./comment.js");

router.use("/posts", postRouter);
router.use("/comments", commentRouter);

module.exports = router;
