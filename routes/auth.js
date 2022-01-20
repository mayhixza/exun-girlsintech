const router = require('express').Router();
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport');
const cookieSession = require('cookie-session')
require('./passport-setup');

router.use(cors())

// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
router.use(bodyParser.json())

router.use(cookieSession({
    name: 'tuto-session',
    keys: ['key1', 'key2']
  }))

// Auth middleware that checks if the user is logged in
const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

// Initializes passport and passport sessions
router.use(passport.initialize());
router.use(passport.session());

// Example protected and unprotected routes
router.get('/failed', (req, res) => res.send('You Failed to log in!'))

// In this route you can see that if the user is logged in u can acess his info in: req.user

// Auth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log(req.user.emails.value);
    req.user = req.user
    res.redirect(`/?username=${req.user.id}`);
  }
);

router.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})

module.exports = router;