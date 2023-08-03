const express = require('express');
const router = express.Router();
const { Comments } = require('../models');
// 댓글 작성
// 댓글 내용을 비워둔 채 댓글 작성 API를 호출하면 "댓글 내용을 입력해주세요" 라는 메세지를 return하기
router.post('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const { user, password, content } = await req.body; // 클라이언트 요청으로 받아온 body 데이터를 구조분해할당으로 상수에 할당
    if (!content) {
      //만약 댓글 내용이 비워져있으면
      return res.status(400).send('댓글 내용을 입력해주세요.'); // 400 에러
    }
    if (!user) {
      //만약 댓글 내용이 비워져있으면
      return res.status(400).send('유저명을 입력해주세요.'); // 400 에러
    }

    if (!password) {
      //만약 비밀번호값이 비워져있으면
      return res.status(400).send('비밀번호를 입력해주세요.'); // 400 에러
    } else {
      Comments.create({ postId, user, password, content }); // Posts모델에 create메소드를 사용 하여 사용자가 입력한 데이터를 저장
      res.json({ message: '댓글을 생성하였습니다.' });
    }
  } catch (error) {
    res.status(400).json({ errorMessage: '댓글 작성에 실패했습니다.' });
  }
});
// 댓글 목록 조회
// 조회하는 게시글에 작성된 모든 댓글을 목록 형식으로 볼 수 있도록 하기
// 작성 날짜 기준으로 내림차순 정렬하기

router.get('/', async (req, res) => {
  try {
    const comments = await Comments.find() // Comments 컬렉션에서 모든 문서를 가져옵니다.
      .select('-password -title  -__v  ') // "password", "content", "__v" 제외
      .sort({ createdAt: -1 });
    res.json(comments); // 가져온 문서를 JSON 형태로 클라이언트에게 전송합니다.
  } catch (err) {
    res.status(500).send('데이터 조회 중 오류가 발생했습니다.'); // 오류가 있는 경우, 에러 메시지를 반환합니다.
  }
});

//제목, 작성자명, 작성 날짜, 작성 내용을 조회하기
//(검색 기능이 아닙니다. 간단한 댓글 조회만 구현해주세요.)
//댓글 commentId로 상세 조회
router.get('/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;
    const comments = await Commnets.find({ _id: commentId }) // Posts 컬렉션에서 모든 문서를 가져옵니다.

      .select('-password') // "password", "content", "__v" 제외
      .sort({ createdAt: -1 });
    res.json(comments); // 가져온 문서를 JSON 형태로 클라이언트에게 전송합니다.
  } catch (err) {
    res.status(500).send('데이터 조회 중 오류가 발생했습니다.'); // 오류가 있는 경우, 에러 메시지를 반환합니다.
  }
});

// 댓글 수정 API
// API를 호출할 때 입력된 비밀번호를 비교하여 동일할 때만 글이 수정되게 하기
//
router.put('/:commentId', async (req, res) => {
  const { commentId } = req.params;
  const { user, content, password } = req.body;
  const existComment = await Comments.findById(commentId);
  try {
    if (!password) {
      res.status(403).json({
        errorMessage: '로그인이 필요한 페이지입니다.',
      });
    } else {
      if (existComment.password === password) {
        await Comments.updateOne({ _id: commentId }, { $set: { user, content, updatedAt: Date.now() } });
        res.status(200).json({
          message: '댓글을 수정하였습니다.',
        });
      } else {
        return res.status(400).json({
          message: '댓글 삭제 권한이 없습니다.',
        });
      }
      if (content === 0) {
        return res.status(412).json({
          errorMessage: '댓글 내용의 형식이 올바르지 않습니다.',
        });
      }

      if (title === 0) {
        return res.status(412).json({
          errorMessage: '댓글 제목의 형식이 올바르지 않습니다.',
        });
      }
    }
  } catch (err) {
    return res.status(400).json({
      message: '데이터 형식이 올바르지 않습니다.',
    });
  }
});

// //댓글 삭제 API
// // API를 호출할 때 입력된 비밀번호를 비교하여 동일할 때만 글이 삭제되게 하기
router.delete('/:commentId', async (req, res) => {
  const { commentId } = req.params;
  const { password } = req.body;
  const existComment = await Comments.findById(commentId);

  try {
    if (!password) {
      res.status(403).json({
        errorMessage: '비밀번호가 다릅니다.',
      });
    } else {
      if (existComment) {
        if (existComment.password === password) {
          await Comments.deleteOne({ _id: commentId });
          res.status(200).json({
            message: '댓글을 삭제하였습니다.',
          });
        } else {
          return res.status(403).json({
            message: '비밀번호가 일치하지 않습니다.',
          });
        }
      } else {
        return res.status(400).json({
          message: '댓글이 존재하지 않습니다.',
        });
      }
    }
  } catch (err) {
    return res.status(400).json({
      message: '데이터 형식이 올바르지 않습니다.',
    });
  }
});

module.exports = router;
