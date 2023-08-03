const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { Posts, Users } = require('../models');

/*게시글 작성 API
    토큰을 검사하여, 유효한 토큰일 경우에만 게시글 작성 가능
    제목, 작성 내용을 입력하기*/

router.post('/', auth, async (req, res) => {
  //토큰을 검사하기 위해 auth 미들웨어를 들렸다가 비동기 처리를 진행
  const { title, content } = req.body;

  if (!title || !content) {
    res.status(400).send('제목 또는 작성 내용을 입력하세요.');
  } else {
    try {
      await Posts.create({
        UserId: res.locals.user.userId,
        title,
        content,
      });

      res.json({ message: '게시글을 생성하였습니다.' });
    } catch (err) {
      console.error(err);
      res.status(500).send('게시글 생성 중 오류가 발생했습니다.');
    }
  }
});

// 전체 게시글 목록 조회 API
// 제목, 작성자명(nickname), 작성 날짜를 조회하기
// 작성 날짜 기준으로 내림차순 정렬하기

router.get('/', async (req, res) => {
  try {
    const posts = await Posts.findAll({
      attributes: ['title', 'createdAt'], //데이터베이스에 저장된 컬럼들중 조회할 컬럼들만 지정
      include: {
        //Users에 있는 컬럼중 nickname이라는 값을 가지고 와서 조회를 해야 함
        model: Users, // Users를 참조
        attributes: ['nickname'], // Users 모델에서 nickname 컬럼만 가져온다.
      },
      order: [['createdAt', 'DESC']], //작성 날짜 기준으로 내림차순 정렬한다.
    });
    res.json(posts); //posts변수안에 저장된 데이터들을 json형태로 응답 처리 해준다.
  } catch (err) {
    console.error(err);
    res.status(500).send('데이터 조회 중 오류가 발생했습니다.');
  }
});
// 제목, 작성자명(nickname), 작성 날짜, 작성 내용을 조회하기
// (검색 기능이 아닙니다. 간단한 게시글 조회만 구현해주세요.)
router.get('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const posts = await Posts.findOne({
      where: { postId: postId },
      attributes: ['title', 'content', 'createdAt'],
      include: {
        model: Users,
        attributes: ['nickname'],
      },
    });

    if (!posts) {
      res.status(404).send('게시글을 찾을 수 없습니다.');
    } else {
      res.json(posts);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('데이터 조회 중 오류가 발생했습니다.');
  }
});
// 게시글 수정 API
// 토큰을 검사하여, 해당 사용자가 작성한 게시글만 수정 가능
router.put('/:postId', auth, async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;

  try {
    const existPost = await Posts.findOne({
      where: {
        postId: postId,
        UserId: res.locals.user.userId, // 현재 로그인한 사용자와 게시물 작성자가 같은지 확인
      },
    });

    if (!existPost) {
      res.status(403).json({
        errorMessage: '게시글 수정 권한이 없습니다..',
      });
      return;
    }

    await Posts.update({ title, content }, { where: { postId: postId } });

    res.status(200).json({
      message: '게시글을 수정하였습니다.',
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: '데이터 형식이 올바르지 않습니다.',
    });
  }
});
// //게시글 삭제 API8.
//로그인 토큰을 검사하여, 해당 사용자가 작성한 댓글만 삭제 가능
//원하는 댓글을 삭제하기
router.delete('/:postId', auth, async (req, res) => {
  const { postId } = req.params;

  try {
    const existPost = await Posts.findOne({ where: { postId } });

    if (!existPost) {
      return res.status(400).json({
        message: '게시글이 존재하지 않습니다.',
      });
    }

    if (existPost.UserId !== res.locals.user.userId) {
      console.log(res.locals.user.userId);
      return res.status(403).json({
        message: '권한이 없습니다.',
      });
    }

    await Posts.destroy({ where: { postId: postId } });
    return res.status(200).json({
      message: '게시글을 삭제하였습니다.',
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: '데이터 형식이 올바르지 않습니다.',
    });
  }
});
module.exports = router;
