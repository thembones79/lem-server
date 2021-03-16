import { Request, Response, NextFunction } from "express";
import { Order } from "../../models/order";

export const closeOrder = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const orderNumber = req.body.orderNumber;

    if (!orderNumber) {
      res.status(422).send({
        error: "You must provide order number!",
      });
      return;
    }

    Order.findOne({ orderNumber }, function (err, existingOrder) {
      if (err) {
        return next(err);
      }

      if (!existingOrder) {
        return res.status(422).send({ error: "Order does not exist!" });
      }

      if (existingOrder.orderStatus === "closed") {
        return res.status(422).send({ error: "Order is already closed!" });
      }

      // logic closed in in IF STATEMENT beause there can be other statuses in the future
      if (existingOrder.orderStatus === "open") {
        existingOrder.orderStatus = "closed";
        existingOrder.save(function (err) {
          if (err) {
            return next(err);
          }
          const message = `Updated order no. ${existingOrder.orderNumber} status to: ${existingOrder.orderStatus}`;

          res.json({
            message,
          });
        });
      } else {
        const message = `No changes were added`;

        res.json({
          message,
        });
      }
    });
  } catch (error) {
    return next(error);
  }
};
