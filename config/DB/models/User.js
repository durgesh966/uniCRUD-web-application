const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    image: String,
    name: String,
    age: Number,
    gender: String,
    email: String,
    phone: String,
    city: String,
    state: String,
    address: String,
    how_heard: String,
    docs: [String],
    date: { type: Date, default: Date.now }
});
userSchema.index({ name: 'text', phone: 'text' }); // Create a text index on 'name' and 'email'

module.exports = mongoose.model('User', userSchema);
