require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = 8080;
const { mongoDB } = require("./mongodb");
const PostItCardModel = require('./models/PostitSchema');
const { User } = require("./models/User.js"); 

// Cors
const corsOptions = {
    origin: true,
    credentials: true, 
};
app.use(cors(corsOptions));

// Body-parser
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false })); 

app.listen(PORT, function() {
    console.log(`Server is running on ${PORT}.`);
});

mongoDB();

// 포스트잇 생성되어있는 리스트 불러오기.
app.get('/api/postlist', async (req, res) => {
    const token = req.cookies.x_auth; // 쿠키에서 액세스 토큰 가져오기
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const userId = decoded._id; // 사용자 ID 추출
  
      // 데이터베이스에서 현재 사용자의 포스트잇 카드만 가져옵니다.
      const postItCards = await PostItCardModel.find({ userId });
      res.status(200).json(postItCards);
    } catch (error) {
      console.error('포스트잇 카드 가져오기 오류:', error);
      res.status(500).json({ error: '내부 서버 오류' });
    }
  });
// 새로운 포스트잇 생성
app.post('/api/CreatePostit', async (req, res) => {
    const { title, content } = req.body;
    const token = req.cookies.x_auth;

    if (!title || !content) {
        return res.status(400).json({ error: '제목과 내용을 입력하지 않았습니다.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = decoded._id;

        const newPostItCard = new PostItCardModel({ title, content, userId });
        const savedPostItCard = await newPostItCard.save();
        res.status(201).json(savedPostItCard);
    } catch (err) {
        console.error('포스트잇 저장 실패:', err);
        res.status(500).json({ error: '서버 오류', message: err.message });
    }
});

// 포스트잇 삭제 요청
app.delete('/api/Deletepostit/:id', async (req, res) => {
    const postId = req.params.id;
  
    try {
      const deletedPostItCard = await PostItCardModel.findByIdAndDelete(postId);
      res.status(200).json(deletedPostItCard);
    } catch (err) {
      console.error('포스트잇 삭제 실패', err);
      res.status(500).json({ error: '서버에러' });
    }
  });

  // 수정하기 버튼 클릭시 해당 아이디 불러와서 제목과 내용 채워줌
  app.get('/api/postlist/:id', async (req, res) => {
    const postId = req.params.id;
    
    try {
      // findById의 결과를 await를 사용하여 기다립니다.
      const post = await PostItCardModel.findById(postId);
  
      // 포스트가 존재하지 않을 때 404 응답
      if (!post) {
        return res.status(404).json({ error: '포스트를 찾을 수 없습니다.' });
      }
  
      // 포스트가 존재할 때 200 응답
      return res.status(200).json(post);
    } catch (error) {
      console.error('에러 발생:', error);
      return res.status(500).json({ error: '내부 서버 오류' });
    }
  });

// 포스트잇 수정하기 기능
  app.put('/api/UpdatePostit/:id', async (req, res) => {
    const postId = req.params.id;
    const { title, content } = req.body;

    try {
        
        const updatedPostItCard = await PostItCardModel.findByIdAndUpdate(
            postId,
            { title, content },
            { new: true } // Set to true to return the updated document
        );

        if (!updatedPostItCard) {
            return res.status(404).json({ error: '포스트잇을 찾을 수 없습니다.' });
        }

     
        res.status(200).json(updatedPostItCard);
    } catch (err) {
        console.error('포스트잇 업데이트 에러', err);
        res.status(500).json({ error: '서버에러' });
    }
});


/*-----   로그인, 회원가입 기능 파트 -----*/

app.post('/api/users/register', async (req, res) => {
  //회원가입시 필요 정보를 client에서 가져오면
  //데이터베이스에 삽입한다

  //body parser를 통해 body에 담긴 정보를 가져온다
  const user = new User(req.body)

  //mongoDB 메서드, user모델에 저장
  const result = await user.save().then(() => {
      res.status(200).json({
          success: true
      })
  }).catch((err) => {
      res.json({ success: false, err })
  })
})


app.post('/api/users/login', async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.body.userId });
        if (!user) {
            return res.status(400).json({ loginSuccess: false, message: "로그인 아이디가 존재하지 않습니다." });
        }

        user.comparePassword(req.body.password, async (error, isMatch) => {
            if (error) return res.status(500).json({ loginSuccess: false, message: "로그인 중 에러가 발생했습니다." });
            if (!isMatch) return res.status(400).json({ loginSuccess: false, message: "비밀번호가 일치하지 않습니다." });

            // 액세스 토큰과 리프레시 토큰 생성
            const accessToken = jwt.sign({ _id: user._id.toHexString() }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            
            const refreshToken = jwt.sign({ _id: user._id.toHexString() }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

            // 리프레시 토큰을 데이터베이스에 저장
            user.refreshToken = refreshToken;
            await user.save();

            // 액세스 토큰은 클라이언트 쿠키에 저장
            res.cookie('x_auth', accessToken, {
                maxAge: 900000, // 15분
                httpOnly: true
            });

            // 리프레시 토큰은 httpOnly 쿠키에 저장
            res.cookie('refreshToken', refreshToken, {
                maxAge: 604800000, // 7일
                httpOnly: true
            });

            return res.status(200).json({ loginSuccess: true, userId: user._id , token: accessToken, userName: user.userName});
        });
    } catch (err) {
        res.status(500).json({ loginSuccess: false, message: "서버 에러" });
    }
});


app.get('/api/users/refreshToken', async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: "리프레시 토큰이 존재하지 않습니다." });
    }

    // 리프레시 토큰 검증
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err) return res.status(403).json({ message: "리프레시 토큰이 유효하지 않습니다." });

        const user = await User.findById(decoded._id);
        if (!user) return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });

        // 새 액세스 토큰 발급
        const accessToken = jwt.sign({ _id: user._id.toHexString() }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        res.cookie('x_auth', accessToken, {
            maxAge: 900000, // 15분
            httpOnly: true
        });

        return res.status(200).json({ message: "액세스 토큰이 갱신되었습니다." });
    });
});