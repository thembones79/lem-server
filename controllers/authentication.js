const jwt = require("jwt-simple");
const User = require("../models/user");
const keys = require("../config/keys");

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, keys.secret);
}

exports.signup = function (req, res, next) {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const password = req.body.password;
  const type = req.body.type;

  if (!email || !firstname || !lastname || !password || !type) {
    return res.status(422).send({
      error:
        "You must provide firstname, lastname, email, password and user type",
    });
  }

  // See if a user with given email exists
  User.findOne({ email: email }, function (err, existingUser) {
    if (err) {
      return next(err);
    }

    // If user exists, return an error
    if (existingUser) {
      return res.status(422).send({ error: "Email in in use" });
    }

    // If user does not exist, create and save user record
    const user = new User({
      firstname,
      lastname,
      email,
      password,
      type,
    });

    user.save(function (err) {
      if (err) {
        return next(err);
      }
      // Respond to request indicating the user was created
      res.json({
        token: tokenForUser(user),
        userType: user.type,
        userName: user.firstname,
        userId: user._id,
      });
    });
  });
};

exports.signin = function (req, res, next) {
  // User has already had their email and password auth'd
  // Just need to give them a token (because of requireSignin middleware)

  res.send({
    token: tokenForUser(req.user),
    userType: req.user.type,
    userName: req.user.firstname,
    userId: req.user._id,
  });
};
