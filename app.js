const express = require("express"); // require: commonjs , import : Es6 현재는
const app = express();
const port = 3000;
const connect = require("./schemas");
const indexRouter = require("./routes/index");

connect(); //몽고db 연결 함수 실행

app.use(express.json()); // 모든 코드에서 request안에 있는 body데이터를 사용함 (req.body)

app.use("/api", indexRouter);

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸습니다.");
});
