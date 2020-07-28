const User = require("../models/user");

exports.addUser = function (req, res, next) {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const password = req.body.password;
  const type = req.body.type;

  console.log(req.user);

  if (req.user.type !== "manager") {
    return res.status(422).send({
      error: "You do not have privileges to add new user!",
    });
  }

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
        userType: user.type,
        userName: user.firstname,
        userId: user._id,
      });
    });
  });
};
