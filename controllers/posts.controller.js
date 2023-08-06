const PostService = require('../services/posts.service');

class PostController {
  // "PostController" 클래스의 postService 프로퍼티 안에 new 키워드를 사용하여
  //PostService 클래스의 인스턴스를 생성 이로 인해 postService는
  // PostService 클래스의 인스턴스, 즉 객체가 된다.
  postService = new PostService();
  //게시글 생성
  createPost = async (req, res) => {
    try {
      const { userId } = res.locals.user;
      const { title, content } = req.body;
      const { code, message } = await this.postService.createPost({
        title,
        content,
        userId,
      });
      return res.status(code).json({ message });
    } catch (err) {
      if (err.code) return res.status(err.code).json({ message: err.message });
      console.error(err);
      res.status(500).send('알 수 없는 에러 발생');
    }
  };

  // //전체 게시글 목록 조회 API
  // //제목, 작성자명(nickname), 작성 날짜, 좋아요 갯수를 조회하기
  // // 작성 날짜 기준으로 내림차순 정렬하기
  getPosts = async (req, res) => {
    try {
      const { code, posts } = await this.postService.getPosts();
      return res.status(code).json(posts);
    } catch (err) {
      if (err.code) return res.status(err.code).json({ message: err.message });
      console.error(err);
      res.status(500).send('알 수 없는 에러 발생');
    }
  };

  // //게시글 상세조회 API
  // // 제목, 작성자명(nickname), 작성 날짜, 작성 내용, 좋아요 갯수를 조회하기
  // //(검색 기능이 아닙니다. 간단한 게시글 조회만 구현해주세요.)
  getPost = async (req, res) => {
    try {
      const { postId } = req.params;
      const { code, post } = await this.postService.getPost(postId);
      return res.status(code).json(post);
    } catch (err) {
      if (err.code) return res.status(err.code).json({ message: err.message });
      console.log(err);
      res.status(500).send('알 수 없는 에러 발생');
    }
  };
  // // 게시글 수정 API
  updatePost = async (req, res) => {
    try {
      const { postId } = req.params;
      const { userId } = res.locals.user;
      const { title, content } = req.body;
      const { code, message } = await this.postService.updatePost(postId, userId, title, content);
      return res.status(code).json({ message });
    } catch (err) {
      if (err.code) return res.status(err.code).json({ message: err.message });
      console.log(err);
      res.status(500).send('알 수 없는 에러 발생');
    }
  };

  deletePost = async (req, res) => {
    try {
      const { postId } = req.params;
      const { userId } = res.locals.user;
      const { code, message } = await this.postService.deletePost(postId, userId);
      return res.status(code).json({ message });
    } catch (err) {
      if (err.code) return res.status(err.code).json({ message: err.message });
      console.log(err);
      res.status(500).send('알 수 없는 에러 발생');
    }
  };
}

module.exports = PostController;

// router.get('/:postId', async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const posts = await Posts.findOne({
//       where: { postId },
//       attributes: ['postId', 'title', 'like', 'content', 'createdAt'],
//       include: {
//         model: Users,
//         attributes: ['nickname'],
//       },
//     });

//     if (!posts) {
//       res.status(404).send('게시글을 찾을 수 없습니다.');
//     } else {
//       res.json(posts);
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('데이터 조회 중 오류가 발생했습니다.');
//   }
// });
