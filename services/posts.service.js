const PostRepository = require('../repositories/posts.repository');

class PostService {
  postRepository = new PostRepository();
  createPost = async ({ userId, title, content }) => {
    await this.postRepository.createOne({ UserId: userId, title, content });
    return { code: 200, message: '게시글 작성이 완료되었습니다.' };
  };

  getPosts = async () => {
    try {
      const posts = await this.postRepository.findAll();
      return { code: 200, posts };
    } catch (err) {
      throw { code: 500, message: '데이터 조회 중 오류가 발생했습니다.' };
    }
  };

  getPost = async (postId) => {
    try {
      const post = await this.postRepository.findOne(postId);
      if (!post) {
        throw { code: 404, message: '게시글을 찾을 수 없습니다.' };
      }
      return { code: 200, post };
    } catch (err) {
      throw err;
    }
  };
  //게시글 수정
  updatePost = async (postId, userId, title, content) => {
    const existPost = await this.postRepository.findByPost(postId, userId);
    try {
      await this.postRepository.updatePost(postId, title, content);
      return { code: 200, message: '게시글을 수정하였습니다.' };
    } catch (err) {
      throw { code: 400, message: '데이터 형식이 올바르지 않습니다.' };
    }
  };

  //게시글 삭제

  deletePost = async (postId, userId) => {
    const existPost = await this.postRepository.findOneByPostId(postId);

    if (!existPost) {
      throw { code: 400, message: '게시글이 존재하지 않습니다.' };
    }

    if (existPost.UserId !== userId) {
      throw { code: 403, message: '권한이 없습니다.' };
    }

    try {
      await this.postRepository.deletePost(postId);
      return { code: 200, message: '게시글을 삭제하였습니다.' };
    } catch (error) {
      throw { code: 400, message: '데이터 형식이 올바르지 않습니다.' };
    }
  };
}

module.exports = PostService;
