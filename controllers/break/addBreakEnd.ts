import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import { Order } from "../../models/order";

export const addBreakEnd = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const orderNumber: string = req.body.orderNumber;
    const breakEnd = new Date();
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

      const thisLineBreaks = breaks.filter((item) => item._line == _line);

      if (thisLineBreaks.length === 0) {
        res.status(422).send({ error: "Break does not exist" });
        return;
      } else {
        const breakId = thisLineBreaks[thisLineBreaks.length - 1]._id;

        const breaksIndex = breaks.findIndex((item) => item._id === breakId);

        breaks[breaksIndex].breakEnd = breakEnd;

        existingOrder.save(function (err) {
          if (err) {
            next(err);
            return;
          }
          res.json({
            existingOrder,
          });
        });
      }
    });
  } catch (err) {
    next(err);
    return;
  }
};
