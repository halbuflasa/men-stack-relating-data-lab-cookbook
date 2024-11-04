const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');
const Ingredient = require('../models/ingredient.js');

// router logic will go here - will be built later on in the lab
router.get('/', async(req,res)=>{
    try {
        const populaterecipes = await Recipe.find({}).populate('owner')
        res.render('recipes/index.ejs', {recipe : populaterecipes}); 
    }catch(error){
        console.log(error)
        res.redirect('/')
    }
});

router.get('/new', async (req, res) => {
  try {
    const ingredients = await Ingredient.find({});
    res.render('recipes/new.ejs', { ingredients });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, instructions, ingredients } = req.body;
    const newRecipe = new Recipe({
      name,
      instructions,
      owner: req.session.user._id,
      ingredients: Array.isArray(ingredients) ? ingredients : [ingredients], // Ensures ingredients are in array form
    });
    await newRecipe.save();
    res.redirect('/recipes');
  } catch (error) {
    console.error("Error saving recipe:", error);
    res.redirect('/');
  }
});


router.get('/:recipeId', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId)
      .populate('owner')
      .populate('ingredients'); // Populate ingredients

    res.render('recipes/show.ejs', { recipe });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});


router.delete('/:recipeId', async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.recipeId)
  
      if (recipe.owner.equals(req.session.user._id)) {
        await recipe.deleteOne()
        res.redirect('/recipes')
      } else {
        res.send("You don't have permission to do that.")
      }
    } catch (error) {
      console.log(error)
      res.redirect('/')
    }
  });

  router.get('/:recipeId/edit', async (req, res) => {
    try {
      const currentRecipe = await Recipe.findById(req.params.recipeId).populate('ingredients');
      const allIngredients = await Ingredient.find({});
      res.render('recipes/edit.ejs', {
        recipe: currentRecipe,
        ingredients: allIngredients
      });
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
  });
  
  
  router.put('/:recipeId', async (req, res) => {
    try {
      const { name, instructions, ingredients } = req.body;
      const currentRecipe = await Recipe.findById(req.params.recipeId);
      if (currentRecipe.owner.equals(req.session.user._id)) {
        await currentRecipe.updateOne({
          name,
          instructions,
          ingredients: Array.isArray(ingredients) ? ingredients : [ingredients]
        });
        res.redirect('/recipes');
      } else {
        res.send("You don't have permission to do that.");
      }
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
  });
  




module.exports = router;
