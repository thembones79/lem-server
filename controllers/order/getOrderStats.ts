import { Request, Response, NextFunction } from "express";
import { Order } from "../../models/order";
import { Line } from "../../models/line";
import { getOrderDetails } from "../../services/getOrderDetails";

export const getOrderStats = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const id = req.params.id;

  if (!id) {
    res.status(422).send({
      error: "You have to provide order id!",
    });
    return;
  }

  Line.find({}, function (err, lines) {
    if (err) {
      return next(err);
    }
    Order.findById(id, function (err, existingOrder) {
      if (err) {
        return next(err);
      }

      if (!existingOrder) {
        res.status(404).send({
          error: "Order not found!",
        });
        return;
      }

      res.json(getOrderDetails(existingOrder, lines));
    });
  });
};
