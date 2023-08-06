const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { Posts, Likes, Users } = require('../models');

const PostsController = require('../controllers/posts.controller');
const postsController = new PostsController();

router.post('/', auth, postsController.createPost); //게시글 등록
router.get('/', postsController.getPosts); // 모든 게시글 조회
router.get('/:postId', postsController.getPost); // 게시글 상세 조회
router.put('/:postId', auth, postsController.updatePost); // 게시글 수정
router.delete('/:postId', auth, postsController.deletePost); // 게시글 삭제

// // 게시글 수정 API
// // 토큰을 검사하여, 해당 사용자가 작성한 게시글만 수정 가능
// router.put('/:postId', auth, async (req, res) => {
//   const { postId } = req.params;
//   const { title, content } = req.body;

//   try {
//     const existPost = await Posts.findOne({
//       where: {
//         postId: postId,
//         UserId: res.locals.user.userId, // 현재 로그인한 사용자와 게시물 작성자가 같은지 확인
//       },
//     });

//     if (!existPost) {
//       res.status(403).json({
//         errorMessage: '게시글 수정 권한이 없습니다..',
//       });
//       return;
//     }

//     await Posts.update({ title, content }, { where: { postId: postId } });

//     res.status(200).json({
//       message: '게시글을 수정하였습니다.',
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(400).json({
//       message: '데이터 형식이 올바르지 않습니다.',
//     });
//   }
// });
// // //게시글 삭제 API8.
// //로그인 토큰을 검사하여, 해당 사용자가 작성한 댓글만 삭제 가능
// //원하는 댓글을 삭제하기
// router.delete('/:postId', auth, async (req, res) => {
//   const { postId } = req.params;

//   try {
//     const existPost = await Posts.findOne({ where: { postId } });

//     if (!existPost) {
//       return res.status(400).json({
//         message: '게시글이 존재하지 않습니다.',
//       });
//     }

//     if (existPost.UserId !== res.locals.user.userId) {
//       console.log(res.locals.user.userId);
//       return res.status(403).json({
//         message: '권한이 없습니다.',
//       });
//     }

//     await Posts.destroy({ where: { postId: postId } });
//     return res.status(200).json({
//       message: '게시글을 삭제하였습니다.',
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(400).json({
//       message: '데이터 형식이 올바르지 않습니다.',
//     });
//   }
// });
module.exports = router;
