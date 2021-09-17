import { Request, Response, NextFunction } from "express";
import { Order } from "../../models/order";

export const getOrder = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const orderNumber = req.params.dashedordernumber.replace(/-/g, "/");

  if (!orderNumber) {
    res.status(422).send({
      error: "You have to provide order number!",
    });
    return;
  }

  Order.findOne({ orderNumber: orderNumber }, function (err, existingOrder) {
    if (err) {
      return next(err);
    }

    res.json({
      existingOrder,
    });
  });
};
