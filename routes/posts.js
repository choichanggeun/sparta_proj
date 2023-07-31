const express = require("express");
const router = express.Router();
const Posts = require("../schemas/post.js");

// 게시글 작성 API
// 제목, 작성자명, 비밀번호, 작성 내용을 입력하기
router.post("/", async (req, res) => {
  const { user, password, title, content } = await req.body; // 클라이언트 요청으로 받아온 body 데이터를 구조분해할당으로 상수에 할당
  if (!user || !password || !title || !content) {
    //하나라도 안적혀 있으면
    res.status(400).send("제목, 작성자명, 비밀번호, 작성 내용을 모두 입력하세요."); // 400 에러
  } else {
    Posts.create({ user, password, title, content }); // Posts모델에 create메소드를 사용 하여 사용자가 입력한 데이터를 저장
    res.json({ message: "게시글을 생성하였습니다." });
  }
});

// 전체 게시글 목록 조회 API
// 제목, 작성자명, 작성 날짜를 조회하기
// 작성 날짜 기준으로 내림차순 정렬하기

router.get("/", async (req, res) => {
  try {
    const posts = await Posts.find() // Posts 컬렉션에서 모든 문서를 가져옵니다.
      .select("-password -content -__v  ") // "password", "content", "__v" 제외
      .sort({ createdAt: -1 });
    res.json(posts); // 가져온 문서를 JSON 형태로 클라이언트에게 전송합니다.
  } catch (err) {
    res.status(500).send("데이터 조회 중 오류가 발생했습니다."); // 오류가 있는 경우, 에러 메시지를 반환합니다.
  }
});
//제목, 작성자명, 작성 날짜, 작성 내용을 조회하기
//(검색 기능이 아닙니다. 간단한 게시글 조회만 구현해주세요.)
//게시글 postId로 상세 조회
router.get("/:postId", async (req, res) => {
  try {
    const {postId} = req.params;
    const posts = await Posts.find({ _id : postId}) // Posts 컬렉션에서 모든 문서를 가져옵니다.
     
    .select("-password") // "password", "content", "__v" 제외
      .sort({ createdAt: -1 });
    res.json(posts); // 가져온 문서를 JSON 형태로 클라이언트에게 전송합니다.
  } catch (err) {
    res.status(500).send("데이터 조회 중 오류가 발생했습니다."); // 오류가 있는 경우, 에러 메시지를 반환합니다.
  }
});
// 게시글 수정 API
// API를 호출할 때 입력된 비밀번호를 비교하여 동일할 때만 글이 수정되게 하기
//
router.put("/:postId", async (req, res) => {
  const { postId } = req.params;
  const { title, content, password } = req.body;
  const existPost = await Posts.findById(postId);
  try {
    if (!password) {
      res.status(403).json({
        errorMessage: "로그인이 필요한 페이지입니다.",
      });
    } else {
      if (existPost) {
        if (existPost.password === password) {
          await Posts.updateOne({ _id: postId }, { $set: { title, content, updatedAt: Date.now() } });
          res.status(200).json({
            message: "게시글을 수정하였습니다.",
          });
          
        }
      } else {
        return res.status(400).json({
          message: "게시글 삭제 권한이 없습니다.",
        });
      }
    }
    if (content === 0) {
      return res.status(412).json({
        errorMessage: "게시글 내용의 형식이 올바르지 않습니다.",
      });
    }

    if (title === 0) {
      return res.status(412).json({
        errorMessage: "게시글 제목의 형식이 올바르지 않습니다.",
      });
    }
  } catch (err) {
    return res.status(400).json({
      message: "데이터 형식이 올바르지 않습니다.",
    });
  }
});

// //게시글 삭제 API
// // API를 호출할 때 입력된 비밀번호를 비교하여 동일할 때만 글이 삭제되게 하기

router.delete("/:postId", async (req, res) => {
  const { postId } = req.params;
  const { password } = req.body;
  const existPost = await Posts.findById(postId);

  try {
    if (!password) {
      res.status(403).json({
        errorMessage: "비밀번호가 다릅니다.",
      });
    } else {
      if (existPost) {
        if (existPost.password === password) {
          await Posts.deleteOne({ _id: postId });
          res.status(200).json({
            message: "게시글을 삭제하였습니다.",
          });
        } else {
          return res.status(403).json({
            message: "비밀번호가 일치하지 않습니다.",
          });
        }
      } else {
        return res.status(400).json({
          message: "게시글이 존재하지 않습니다.",
        });
      }
    }
  } catch (err) {
    return res.status(400).json({
      message: "데이터 형식이 올바르지 않습니다.",
    });
  }
});


module.exports = router;
