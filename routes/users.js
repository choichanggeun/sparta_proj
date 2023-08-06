const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const jwt = require('jsonwebtoken');

/*회원 가입 API
 닉네임, 비밀번호, 비밀번호 확인을 request에서 전달받기
 닉네임은 `최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)`로 구성하기
 비밀번호는 `최소 4자 이상이며, 닉네임과 같은 값이 포함된 경우 회원가입에 실패`로 만들기
 비밀번호 확인은 비밀번호와 정확하게 일치하기
 데이터베이스에 존재하는 닉네임을 입력한 채 회원가입 버튼을 누른 경우 "중복된 닉네임입니다." 
 라는 에러메세지를 response에 포함하기*/

router.post('/signup', async (req, res) => {
  const { nickname, email, password, confirmPassword } = req.body; //회원가입에 필요한 데이터를 body데이터에 담아서 요청
  const nickCheck = /[a-zA-Z0-9]{3,}$/; // 최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)`로 구성

  if (!nickCheck.test(nickname)) {
    // 정규식이 맞는지 확인하는 .test는 자바스크립트에서 제공하는 정규식을 검증하는? 메소드다
    return res.status(412).json({
      errorMessage: '닉네임 형식이 일치하지 않습니다.',
    });
  }
  //비밀번호 정규식
  const pwdCheck = /^.{4,}$/; // pwd는 4글자 이상
  if (!pwdCheck.test(password) || password.includes(nickname)) {
    //비밀번호에 닉네임값이 있는지 includes를 사용하여 확인
    return res.status(412).json({
      errorMessage: '비밀번호 형식이 일치하지 않거나 닉네임이 포함되어 있습니다.',
    });
  }
  // 비밀번호 확인이 비밀번호와 일치하는지 검사합니다.
  if (password !== confirmPassword) {
    return res.status(412).json({
      errorMessage: '비밀번호 확인이 올바르지 않습니다.',
    });
  }

  try {
    // 데이터베이스에서 닉네임이 이미 있는지 확인합니다.
    const existingUser = await Users.findOne({ where: { nickname } });

    // 닉네임이 이미 있는 경우, 중복 오류를 반환합니다.
    if (existingUser) {
      return res.status(412).json({
        errorMessage: '중복된 닉네임입니다.',
      });
    }

    // 회원가입 처리 로직 (닉네임 중복이 없고 모든 검증이 완료되었습니다.)
  } catch (error) {
    // 데이터베이스 검색 오류 처리
    console.error(error);
    res.status(500).json({
      errorMessage: '회원 가입 과정 중 오류가 발생했습니다.',
    });
  }
  const newUser = await Users.create({ nickname, email, password }); //사용자에 요청으로 들어온 nickname email password를
  //newUser라는 변수안에 할당
  res.status(201).json({
    message: '회원 가입에 성공하였습니다.',
    data: newUser,
  });
});

//로그인
router.post('/login', async (req, res) => {
  const { nickname, password } = req.body;
  const user = await Users.findOne({ where: { nickname: nickname } });
  if (!user) {
    return res.status(409).json({ errorMessage: '가입되지 않은 아이디입니다. 아이디를 확인해주세요' });
  } else if (password !== user.password) {
    return res.status(409).json({ errMessage: '비밀번호를 확인하여 주십시오.' });
  }

  const token = jwt.sign(
    {
      userId: user.userId,
    },
    'customized-secret-key'
  );
  res.cookie('Authorization', `Bearer ${token}`);
  return res.json({ message: '로그인 완료' });
});

module.exports = router;
