const express = require("express");
const { registerUser, loginUser } = require("../Controllers/AuthController");

const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
    '/google/callback',
    passport.authenticate('google', { session: false }),
    (req, res) => {
        const token = jwt.sign(
            { id: req.user.id, email: req.user.email },
            process.env.jwt_secret,
            { expiresIn: '1h' }
        );
        res.json({ token });
    }
);



router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;

