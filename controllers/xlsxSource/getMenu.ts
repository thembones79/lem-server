import { Request, Response, NextFunction } from "express";
import { XlsxSource } from "../../models/xlsxSource";

export const getMenu = function (
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
