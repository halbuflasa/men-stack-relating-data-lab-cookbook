const express = require('express');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const addUserToViews = require('./middleware/addUserToViews');
require('dotenv').config();
require('./config/database');

// Controllers
const isSignedIn = require('./middleware/isSignedIn');
const authController = require('./controllers/auth');
const recipesController = require('./controllers/recipes.js');
// const ingredientsController = require('./controllers/ingredients.js');

const app = express();
const port = process.env.PORT ? process.env.PORT : '3000';

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride('_method'));
// Morgan for logging HTTP requests
app.use(morgan('dev'));

// **Session Middleware** - move this before routes
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

// Custom Middleware
app.use(addUserToViews);

// Public Routes
app.get('/', async (req, res) => {
  if (req.session.user) {
    console.log(req.session.user);
    return res.redirect(`/users/${req.session.user._id}/recipes`);
  }
  res.render('index.ejs');
});

// **Routes that need session access**
app.use('/auth', authController);
app.use('/recipes', recipesController); // This route can now access req.session

// Protected Routes (after `isSignedIn` middleware)
app.use(isSignedIn);
app.use('/users/:userId/recipes', recipesController);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
