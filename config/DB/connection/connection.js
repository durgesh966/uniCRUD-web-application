const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGOURI);
    console.log(`MongoDB Connected`.bgCyan.black);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;