const Redirection = require("../models/redirection");

exports.addRedirection = function (req, res, next) {
  let { redirRoute, description, fileName } = req.body;

  redirRoute = redirRoute.trim();
  description = description.trim();
  fileName = fileName.trim();

  if (!description || !redirRoute || !fileName) {
    return res.status(422).send({
      error: "You must provide description, redirection route and file name!",
    });
  }
  const targetUrl = `https://riverdi.sharepoint.com/sites/Produkcja/Shared%20Documents/Instrukcje/${fileName}.pdf`;

  Redirection.findOne({ redirRoute }, function (err, existingRedirection) {
    if (err) {
      return next(err);
    }

    if (existingRedirection) {
      return res.status(422).send({ error: "Redirection already defined!" });
    }

    const redirection = new Redirection({
      description,
      redirRoute,
      targetUrl,
    });

    redirection.save(function (err) {
      if (err) {
        return next(err);
      }

      res.json({
        description: redirection.description,
        redirRoute: redirection.redirRoute,
        targetUrl: redirection.targetUrl,
        redirId: redirection._id,
      });
    });
  });
};

exports.redirectTo = function (req, res, next) {
  let redirRoute = req.params.redirRoute;

  if (!redirRoute) {
    return res.status(422).send({
      error: "You must provide redirection route!",
    });
  }

  redirRoute = redirRoute.trim();

  Redirection.findOne({ redirRoute }, function (err, existingRedirection) {
    if (err) {
      return next(err);
    }

    if (!existingRedirection) {
      return res.status(422).send({ error: "Redirection not defined!" });
    }

    const { targetUrl } = existingRedirection;

    res.redirect(targetUrl);
  });
};
