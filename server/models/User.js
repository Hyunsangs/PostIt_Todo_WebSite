const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // 비밀번호를 암호화 시키기 위해
const jwt = require('jsonwebtoken');
const saltRounds = 10; // salt를 몇 글자로 할지




const userSchema = mongoose.Schema({
    userName: {
        type:String,
    },
    userId: {
        type:String,
        trim:true, // 스페이스를 없애주는 역할
        unique: true,
    },
    password: {
        type: String,
        minlength: 5,
    },
    userAge: {
        type: Number,
    },
    email: {
        type: String,
    },
    role: {
        // 관리자와 일반 유저를 구분하기 위한 역할
        type: Number,
        default: 0, // 0은 일반 유저, 1은 관리자
    },
      refreshToken: {
      type: String,
      default: ""
    }
});

userSchema.pre("save", function (next) {
    const user = this;
    // Encrypt only when changing the password.
    if (user.isModified("password")) {
      bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function (err, hash) {
          if (err) return next(err);
          user.password = hash;
          next();
        });
      });
    } else {
      next();
    }
  });

  userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

userSchema.methods.generateToken = async function() {
  let user = this;
  // 액세스 토큰 생성
  let accessToken = jwt.sign({ 
    _id: user._id.toHexString(), 
    userName: user.userName
  }, 
  process.env.ACCESS_TOKEN_SECRET, 
  { expiresIn: '15m' });

  // 리프레시 토큰 생성
  let refreshToken = jwt.sign({
    _id: user._id.toHexString()
  },
  process.env.REFRESH_TOKEN_SECRET,
  { expiresIn: '7d' });

  // 리프레시 토큰만 사용자 문서에 저장
  user.refreshToken = refreshToken;
  
  try {
      await user.save(); // 변경 사항 저장
      return { accessToken, refreshToken }; // 생성된 토큰 반환
  } catch (err) {
      throw err;
  }
};

const User = mongoose.model("User", userSchema); // 스키마를 모델로 감싼다.

module.exports = { User };