const ObjectId = require("mongoose").Types.ObjectId;

const { SHAREPOINT_PATH, FILE_EXTENSION } = require("../config/config");
const Redirection = require("../models/redirection");
const Product = require("../models/product");

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
  const targetUrl = SHAREPOINT_PATH + fileName + FILE_EXTENSION;

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
      fileName,
    });

    redirection.save(function (err) {
      if (err) {
        return next(err);
      }

      res.json({
        redirection,
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

exports.changeRedirection = function (req, res, next) {
  const _id = req.params._id;
  let { redirRoute, description, fileName } = req.body;

  redirRoute = redirRoute.trim();
  description = description.trim();
  fileName = fileName.trim();

  if (!_id) {
    return res.status(422).send({
      error: "You must provide id!",
    });
  }

  if (!description || !redirRoute || !fileName) {
    return res.status(422).send({
      error: "You must provide description, redirection route and file name!",
    });
  }

  Redirection.findOne({ redirRoute }, function (err, anotherRedirection) {
    if (err) {
      return next(err);
    }

    if (anotherRedirection && anotherRedirection._id != _id) {
      return res.status(422).send({ error: "Route already defined!" });
    }

    const targetUrl = SHAREPOINT_PATH + fileName + FILE_EXTENSION;

    Redirection.findOne({ _id }, function (err, existingRedirection) {
      if (err) {
        return next(err);
      }

      if (!existingRedirection) {
        return res.status(422).send({ error: "No redirection found!" });
      }

      existingRedirection.description = description;
      existingRedirection.redirRoute = redirRoute;
      existingRedirection.targetUrl = targetUrl;
      existingRedirection.fileName = fileName;

      existingRedirection.save(function (err) {
        if (err) {
          return next(err);
        }

        res.json(existingRedirection);
      });
    });
  });
};

exports.deleteRedirection = function (req, res, next) {
  try {
    const _id = req.params._id;

    if (!_id) {
      return res.status(422).send({
        error: "You must provide redirection id!",
      });
    }

    if (!ObjectId.isValid(_id)) {
      return res.status(422).send({
        error: "Invalid id!",
      });
    }

    Product.updateMany(
      { linksToRedirs: { $in: _id } },
      { $pull: { linksToRedirs: _id } },
      { safe: true, upsert: true },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          Redirection.findOneAndRemove(
            { _id },
            function (err, existingRedirection) {
              if (err) {
                return next(err);
              } else if (!existingRedirection) {
                return res
                  .status(422)
                  .send({ error: "Redirection does not exist!" });
              } else {
                const message = `Deleted redirection from /${existingRedirection.redirRoute}`;

                res.json({
                  message,
                });
              }
            }
          );
        }
      }
    );
  } catch (error) {
    return next(error);
  }
};

exports.getRedirections = function (req, res, next) {
  Redirection.find({}, function (err, redirections) {
    if (err) {
      return next(err);
    }

    res.json({ redirections });
  });
};

exports.getRedirWithProds = function (req, res, next) {
  const redirId = req.params._id;

  console.log({ redirId });

  if (!redirId) {
    return res.status(422).send({
      error: "You must provide redirection id!",
    });
  }

  if (!ObjectId.isValid(redirId)) {
    return res.status(422).send({
      error: "Invalid id!",
    });
  }

  Redirection.findOne({ _id: redirId }, function (err, existingRedirection) {
    if (err) {
      return next(err);
    }

    if (!existingRedirection) {
      return res.status(422).send({ error: "Redirection not defined!" });
    }

    Product.find(
      {
        linksToRedirs: { $in: redirId },
      },
      "partNumber"
    ).exec(function (err, prodsWithThisRedir) {
      if (err) {
        console.log({ err });
        return next(err);
      }

      res.json({ existingRedirection, prodsWithThisRedir });
    });
  });
};
