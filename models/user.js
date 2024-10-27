const mongoose = require('mongoose');

const foodSchema =  new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

});


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  food:  [foodSchema],
});

module.exports = mongoose.model('User', userSchema);
