const mongoose = require('mongoose');

const postItCardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  userId: { // 사용자 ID를 저장하는 필드 추가
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // 'User' 모델을 참조
    required: true,
  },
  // 기타 필드...
});

const PostItCardModel = mongoose.model('PostItCard', postItCardSchema);

module.exports = PostItCardModel;