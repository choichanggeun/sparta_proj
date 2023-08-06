const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { Posts, Users, Comments } = require('../models');

// 댓글 작성 API
// 로그인 토큰을 검사하여, 유효한 토큰일 경우에만 댓글 작성 가능
// 댓글 내용을 비워둔 채 댓글 작성 API를 호출하면 "댓글 내용을 입력해주세요" 라는 메세지를 return하기
router.post('/:postId', auth, async (req, res) => {
  //토큰을 검사하기 위해 auth 미들웨어를 들렸다가 비동기 처리를 진행
  const PostId = req.params.postId;
  const { comment } = req.body;
  const UserId = res.locals.user.userId;
  if (!comment) {
    res.status(400).send('제목 또는 작성 내용을 입력하세요.');
  } else {
    try {
      await Comments.create({
        PostId: req.params.postId,
        UserId: res.locals.user.userId,
        comment,
      });

      res.json({ message: '댓글을 생성하였습니다.' });
    } catch (err) {
      console.error(err);
      res.status(500).send('댓글 생성 중 오류가 발생했습니다.');
    }
  }
});

// 댓글 목록 조회 API
// 로그인 토큰을 전달하지 않아도 댓글 목록 조회가 가능하도록 하기
//  조회하는 게시글에 작성된 모든 댓글을 목록 형식으로 볼 수 있도록 하기
//  작성 날짜 기준으로 내림차순 정렬하기

router.get('/:postId', async (req, res) => {
  try {
    const comment = await Comments.findAll({
      attributes: ['comment', 'PostId', 'UserId', 'createdAt'], //데이터베이스에 저장된 컬럼들중 조회할 컬럼들만 지정
      order: [['createdAt', 'DESC']], //작성 날짜 기준으로 내림차순 정렬한다.
    });
    res.json(comment); //posts변수안에 저장된 데이터들을 json형태로 응답 처리 해준다.
  } catch (err) {
    console.error(err);
    res.status(500).send('데이터 조회 중 오류가 발생했습니다.');
  }
});
// 로그인 토큰을 검사하여, 해당 사용자가 작성한 댓글만 수정 가능
// 댓글 내용을 비워둔 채 댓글 수정 API를 호출하면 "댓글 내용을 입력해주세요" 라는 메세지를 return하기
router.put('/:commentId', auth, async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!content) {
    res.status(400).send('댓글 내용을 입력해주세요.');
    return;
  }

  try {
    const existComment = await Comments.findOne({
      where: {
        commentId: commentId,
        UserId: res.locals.user.userId, // 현재 로그인한 사용자와 댓글 작성자가 같은지 확인
      },
    });

    if (!existComment) {
      res.status(403).json({
        errorMessage: '댓글 수정 권한이 없습니다.',
      });
      return;
    }

    await Comments.update({ content }, { where: { commentId: commentId } });

    res.status(200).json({
      message: '댓글이 수정되었습니다.',
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: '데이터 형식이 올바르지 않습니다.',
    });
  }
});
// //댓글 삭제 API
//로그인 토큰을 검사하여, 해당 사용자가 작성한 댓글만 삭제 가능
//원하는 댓글을 삭제하기
router.delete('/:commentId', auth, async (req, res) => {
  const { commentId } = req.params;

  try {
    const existPost = await Comments.findOne({ where: { commentId } });

    if (!existPost) {
      return res.status(400).json({
        message: '댓글이 존재하지 않습니다.',
      });
    }

    if (existPost.UserId !== res.locals.user.userId) {
      console.log(res.locals.user.userId);
      return res.status(403).json({
        message: '댓글 삭제 권한이 없습니다.',
      });
    }

    await Comments.destroy({ where: { commentId } });
    return res.status(200).json({
      message: '댓글을 삭제하였습니다.',
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: '데이터 형식이 올바르지 않습니다.',
    });
  }
});
module.exports = router;
