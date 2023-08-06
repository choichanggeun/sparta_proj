const { Posts, Users } = require('../models');

class PostRepository {
  //게시글 등록
  createOne = async ({ UserId, title, content }) => {
    const posts = await Posts.create({ UserId, title, content });
    return posts; // 게시글 작성 후 생성된 게시글을 반환합니다.
  };

  // //전체 게시글 목록 조회 API
  // //제목, 작성자명(nickname), 작성 날짜, 좋아요 갯수를 조회하기
  // // 작성 날짜 기준으로 내림차순 정렬하기
  findAll = async () => {
    const posts = await Posts.findAll({
      attributes: ['postId', 'UserId', 'title', 'createdAt', 'like'],
      include: {
        model: Users,
        attributes: ['nickname'],
      },
      order: [['createdAt', 'DESC']],
    });

    return posts;
  };

  // //게시글 상세조회 API
  // // 제목, 작성자명(nickname), 작성 날짜, 작성 내용, 좋아요 갯수를 조회하기
  // //(검색 기능이 아닙니다. 간단한 게시글 조회만 구현해주세요.)
  findOne = async (postId) => {
    const post = await Posts.findOne({
      where: { postId },
      attributes: ['postId', 'title', 'like', 'content', 'createdAt'],
      include: {
        model: Users,
        attributes: ['nickname'],
      },
    });
    return post;
  };
  //게시글 수정
  findByPost = async (postId, userId) => {
    const existPost = await Posts.findOne({
      where: {
        postId: postId,
        UserId: userId,
      },
    });
    return existPost;
  };
  updatePost = async (postId, title, content) => {
    await Posts.update({ title, content }, { where: { postId: postId } });
  };

  findOneByPostId = async (postId) => {
    const existPost = await Posts.findOne({
      where: {
        postId: postId,
      },
    });

    return existPost;
  };

  deletePost = async (postId) => {
    await Posts.destroy({ where: { postId: postId } });
  };
}

module.exports = PostRepository;
