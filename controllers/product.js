const ObjectId = require("mongoose").Types.ObjectId;

const { SHAREPOINT_PATH, FILE_EXTENSION } = require("../config/config");
const Product = require("../models/product");

exports.addProduct = function (req, res, next) {
  let { partNumber } = req.body;

  if (!partNumber) {
    return res.status(422).send({
      error: "You must provide part number!",
    });
  }

  partNumber = partNumber.trim();

  Product.findOne({ partNumber }, function (err, existingProduct) {
    if (err) {
      return next(err);
    }

    if (existingProduct) {
      return res.status(422).send({ error: "Product already exists!" });
    }

    const product = new Product({
      partNumber,
      linksToDocs: [],
      linksToRedirs: [],
    });

    product.save(function (err) {
      if (err) {
        return next(err);
      }

      res.json({
        product,
      });
    });
  });
};

exports.addLink = function (req, res, next) {
  let { partNumber, description, fileName } = req.body;

  if (!partNumber | !description | !fileName) {
    return res.status(422).send({
      error: "You must provide part number, link description and file name!",
    });
  }

  partNumber = partNumber.trim();
  description = description.trim();
  fileName = fileName.trim();

  const url = SHAREPOINT_PATH + fileName + FILE_EXTENSION;

  Product.findOne({ partNumber }, function (err, existingProduct) {
    if (err) {
      console.log({ err });
      return next(err);
    }

    if (!existingProduct) {
      return res.status(422).send({ error: "Product does not exist!" });
    }

    existingProduct.linksToDocs.push({ description, url, fileName });

    existingProduct.save(function (err) {
      if (err) {
        return next(err);
      }

      res.json({
        existingProduct,
      });
    });
  });
};

exports.addRedirection = function (req, res, next) {
  let { partNumber, _redirection } = req.body;

  if (!partNumber | !_redirection) {
    return res.status(422).send({
      error: "You must provide part number and redirection id!",
    });
  }

  partNumber = partNumber.trim();

  Product.findOne({ partNumber })
    .populate("linksToRedirs")
    .exec(async function (err, existingProduct) {
      if (err) {
        console.log({ err });
        return next(err);
      }

      if (!existingProduct) {
        return res.status(422).send({ error: "Product does not exist!" });
      }

      existingProduct.linksToRedirs.push(_redirection);

      try {
        await existingProduct.save(function (err) {
          if (err) {
            console.log({ err });
            res.status(400).send("Error");
            return next(new Error("save error"));
          }

          res.json({
            existingProduct,
          });
        });
      } catch (error) {
        console.log({ error });
        next(error);
        return;
      }
    });
};

exports.changeProduct = function (req, res, next) {
  let { partNumber, linksToDocs, linksToRedirs } = req.body;

  if (!partNumber | !linksToDocs | !linksToRedirs) {
    return res.status(422).send({
      error: "You must provide part number, link array and redirection array!",
    });
  }

  if (!Array.isArray(linksToDocs) | !Array.isArray(linksToRedirs)) {
    return res.status(422).send({
      error: "linksToDocs and linksToRedirs have to be arrays!",
    });
  }

  partNumber = partNumber.trim();

  Product.findOne({ partNumber }, function (err, existingProduct) {
    if (err) {
      console.log({ err });
      return next(err);
    }

    if (!existingProduct) {
      return res.status(422).send({ error: "Product does not exist!" });
    }

    existingProduct.linksToDocs = linksToDocs;
    existingProduct.linksToRedirs = linksToRedirs;

    existingProduct.save(function (err) {
      if (err) {
        return next(err);
      }

      res.json({
        existingProduct,
      });
    });
  });
};

exports.getProducts = function (req, res, next) {
  Product.find({}, "partNumber", function (err, products) {
    if (err) {
      return next(err);
    }

    res.json({ products });
  });
};

exports.getProduct = function (req, res, next) {
  const { _id } = req.params;

  if (!_id) {
    return res.status(422).send({
      error: "You must provide product id!",
    });
  }

  if (!ObjectId.isValid(_id)) {
    return res.status(422).send({
      error: "Invalid id!",
    });
  }

  Product.findOne({ _id })
    .populate("linksToRedirs")
    .exec(function (err, existingProduct) {
      if (err) {
        console.log({ err });
        return next(err);
      }

      if (!existingProduct) {
        return res.status(422).send({ error: "Product does not exist!" });
      }
      res.json({ existingProduct });
    });
};

exports.deleteProduct = function (req, res, next) {
  try {
    const _id = req.params._id;

    if (!_id) {
      return res.status(422).send({
        error: "You must provide product id!",
      });
    }

    if (!ObjectId.isValid(_id)) {
      return res.status(422).send({
        error: "Invalid id!",
      });
    }

    Product.findOneAndRemove({ _id }, function (err, existingProduct) {
      if (err) {
        return next(err);
      } else if (!existingProduct) {
        return res.status(422).send({ error: "Product does not exist!" });
      } else {
        const message = `Deleted ${existingProduct.partNumber}`;

        res.json({
          message,
        });
      }
    });
  } catch (error) {
    return next(error);
  }
};

exports.updateManyProdsWithOneRedir = function (req, res, next) {
  const redirId = req.params._id;
  const { productList } = req.body;

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

  if (!productList) {
    return res.status(422).send({
      error: "No product list!",
    });
  }

  if (!Array.isArray(productList)) {
    return res.status(422).send({
      error: "product list has to be an array!",
    });
  }

  Product.find({
    linksToRedirs: { $in: redirId },
  }).exec(function (err, prodsWithThisRedir) {
    if (err) {
      console.log({ err });
      return next(err);
    }

    Product.find({
      partNumber: { $in: productList },
    }).exec(function (err, prodsFromList) {
      if (err) {
        console.log({ err });
        return next(err);
      }

      Product.updateMany(
        { linksToRedirs: { $in: redirId } },
        { $pull: { linksToRedirs: redirId } },
        { safe: true, upsert: true },
        function (err, docs) {
          if (err) {
            console.log(err);
          } else {
            console.log("Updated Docs : ", docs);
          }
        }
      );

      Product.updateMany(
        { partNumber: { $in: productList } },
        { $push: { linksToRedirs: redirId } },
        { safe: true, upsert: true },
        function (err, docs) {
          if (err) {
            console.log(err);
          } else {
            console.log("Updated Docs : ", docs);
          }
        }
      );

      res.json({
        prodsFromList,
        prodsWithThisRedir,
      });
    });
  });
};

exports.updateManyProdsWithOneRedirOLD = function (req, res, next) {
  const redirId = req.params._id;
  const { productList } = req.body;

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

  if (!productList) {
    return res.status(422).send({
      error: "No product list!",
    });
  }

  if (!Array.isArray(productList)) {
    return res.status(422).send({
      error: "product list has to be an array!",
    });
  }

  Product.find({
    linksToRedirs: { $in: redirId },
  }).exec(function (err, prodsWithThisRedir) {
    if (err) {
      console.log({ err });
      return next(err);
    }

    Product.find({
      partNumber: { $in: productList },
    }).exec(function (err, prodsFromList) {
      if (err) {
        console.log({ err });
        return next(err);
      }

      res.json({
        prodsFromList,
        prodsWithThisRedir,
      });
    });
  });
};

exports.destroyLink = function (req, res) {
  Node.findByIdAndUpdate(
    req.params.id,
    { $pull: { "configuration.links": { _id: req.params.linkId } } },
    { safe: true, upsert: true },
    function (err, node) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(node.configuration.links);
    }
  );
};

//User.updateMany({ age: { $gte: 5 } }, { name: "ABCD" }, function (err, docs) {
//  if (err) {
//    console.log(err);
//  } else {
//    console.log("Updated Docs : ", docs);
//  }
//});
