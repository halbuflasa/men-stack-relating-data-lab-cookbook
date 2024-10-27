const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      }, 
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
     
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports = Ingredient;