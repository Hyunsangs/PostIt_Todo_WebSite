const mongoose = require("mongoose");
require('dotenv').config();

const URL = process.env.MONGODB_SECRTE_KEY
exports.mongoDB = () => {
  
  mongoose
  .connect(URL, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log("몽고디비 연결 성공"))
  .catch((error) => console.log("몽고디비 연결 실패:" , error));  
}