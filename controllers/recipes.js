const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');

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

router.get('/new', async(req,res)=>{
    res.render('recipes/new.ejs');
});

router.post('/', async (req, res) => {
    console.log("Session user in POST /recipes:", req.session.user);
    try {
        const newRecipe = new Recipe(req.body);
        newRecipe.owner = req.session.user._id;
        await newRecipe.save();
        res.redirect('/recipes');
    } catch (error) {
        console.error("Error saving recipe:", error);
        res.redirect('/');
    }
});

router.get('/:recipeId', async(req,res)=>{
    try {
        const recipe = await Recipe.findById(
          req.params.recipeId
        ).populate('owner')
    
        res.render('recipes/show.ejs', {
          recipe
        })
      } catch (error) {
        console.log(error)
        res.redirect('/')
      }
    
});

router.delete('/:recipeId', async (req, res) => {
    try {
      const recipe = await REcipe.findById(req.params.recipeId)
  
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
      const currentRecipe = await Recipe.findById(req.params.recipeId)
      res.render('recipes/edit.ejs', {
        recipe: currentRecipe,
      })
    } catch (error) {
      console.log(error)
      res.redirect('/')
    }
  });
  
  router.put('/:recipeId', async (req, res) => {
    try {
      const currentRecipe = await Recipe.findById(req.params.recipeId)
      if (currentRecipe.owner.equals(req.session.user._id)) {
        await currentRecipe.updateOne(req.body)
        res.redirect('/recipes')
      } else {
          res.send("You don't have permission to do that.")
      }
    } catch (error) {
      console.log(error)
      res.redirect('/')
    }
  });
  




module.exports = router;
