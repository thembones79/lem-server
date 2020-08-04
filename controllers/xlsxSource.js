const XlsxSource = require("../models/xlsxSource");

exports.updateMenu = function (req, res, next) {
  const idCode = "menu";
  const menuContent = req.body.menuContent;

  XlsxSource.findOne({ idCode: idCode }, function (err, existingMenu) {
    if (err) {
      return next(err);
    }

    if (!menuContent) {
      return res.status(422).send({ error: "Menu content is missing" });
    }

    existingMenu.menuContent = menuContent;
    existingMenu.timeStamp = new Date();

    existingMenu.save(function (err) {
      if (err) {
        return next(err);
      }

      res.json({
        existingMenu,
      });
    });
  });
};

exports.getMenu = function (req, res, next) {
  const idCode = "menu";

  XlsxSource.findOne({ idCode: idCode }, function (err, existingMenu) {
    if (err) {
      return next(err);
    }
    res.json({
      timestamp: existingMenu.timeStamp,
      menuContent: existingMenu.menuContent,
    });
  });
};
