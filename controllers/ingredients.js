const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Ingredient = require('../models/ingredient.js');


router.get('/', async(req,res)=>{
    try {
        const populateIngredients = await Ingredient.find({}).populate('owner')
        res.render('ingredients/index.ejs', {ingredients : populateIngredients}); 

    }catch(error){
        console.log(error)
        res.redirect('/')
    }
});


router.get('/new', async(req,res)=>{
    res.render('ingredients/new.ejs');
});

router.post('/', async (req, res) => {
    try {
        const newIngredient = new Ingredient(req.body);
        newIngredient.owner = req.session.user._id;
        await newIngredient.save();
        res.redirect('/ingredients');
    } catch (error) {
        console.error("Error saving recipe:", error);
        res.redirect('/');
    }
});





module.exports = router;