import { Router, Request, Response, NextFunction } from "express";
import { XlsxSource } from "../models/xlsxSource";

exports.updateMenu = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const idCode = "menu";
  const menuContent = req.body.menuContent;
  const timeStamp = req.body.timeStamp;

  XlsxSource.findOne({ idCode: idCode }, function (err, existingMenu) {
    if (err) {
      return next(err);
    }

    if (!menuContent) {
      return res.status(422).send({ error: "Menu content is missing" });
    }

    if (!existingMenu) {
      return res.status(422).send({ error: "Menu not found" });
    }

    existingMenu.menuContent = menuContent;
    existingMenu.timeStamp = timeStamp || new Date();

    existingMenu.save(function (err) {
      if (err) {
        return next(err);
      }

      res.json({
        what: "is going on",
        existingMenu,
        message: "OK",
      });
    });
  });
};

exports.getMenu = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const idCode = "menu";

  XlsxSource.findOne({ idCode: idCode }, function (err, existingMenu) {
    if (err) {
      return next(err);
    }

    if (!existingMenu) {
      return res.status(422).send({ error: "Menu not found" });
    }

    res.json({
      timestamp: existingMenu.timeStamp,
      menuContent: existingMenu.menuContent,
    });
  });
};
