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
        partNumber: product.partNumber,
        linksToDocs: product.linksToDocs,
        linksToRedirs: product.linksToRedirs,
        productId: product._id,
      });
    });
  });
};
