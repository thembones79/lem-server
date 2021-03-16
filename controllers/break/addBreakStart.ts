import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import { Order } from "../../models/order";
import { Break } from "../../models/break";

export const addBreakStart = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const orderNumber: string = req.body.orderNumber;
  const breakStart = new Date();
  const _line: mongoose.Schema.Types.ObjectId = req.body._line;

  if (!orderNumber || !_line) {
    res.status(422).send({
      error: "Not enough values!",
    });
    return;
  }
  Order.findOne({ orderNumber: orderNumber }, function (err, existingOrder) {
    if (err) {
      next(err);
      return;
    }

    if (!existingOrder) {
      res.status(422).send({ error: "Order does not exist" });
      return;
    }

    const { orderStatus, breaks } = existingOrder;

    if (orderStatus === "closed") {
      res.status(422).send({ error: "Order is completed" });
      return;
    }

    // broken naming convention: "newBreak" instead of "break", because "break" is a special, reserved word
    const newBreak = new Break({
      breakStart,
      _line,
    });

    breaks.push(newBreak);

    existingOrder.save(function (err) {
      if (err) {
        next(err);
        return;
      }
      res.json({
        existingOrder,
      });
    });
  });
};
