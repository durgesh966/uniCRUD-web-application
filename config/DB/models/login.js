const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  phone: Number,
  password: { type: String, unique: true }
});
module.exports = mongoose.model('Login', userSchema);
