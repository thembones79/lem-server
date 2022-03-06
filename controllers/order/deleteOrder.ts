import { Request, Response, NextFunction } from "express";
import { Order } from "../../models/order";
import { OrderStatistics } from "../../models/orderStatistics";

export const deleteOrder = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const orderNumber = req.params.dashedordernumber.replace(/-/g, "/");

    if (!orderNumber) {
      res.status(422).send({
        error: "You must provide order number!",
      });
      return;
    }

    Order.findOneAndRemove({ orderNumber }, function (err, existingOrder) {
      if (err) {
        return next(err);
      } else if (!existingOrder) {
        return res.status(422).send({ error: "Order does not exist!" });
      } else {
        OrderStatistics.findOneAndRemove(
          { orderNumber },
          function (error, existingOrderStats) {
            if (error) {
              return next(error);
            }
          }
        );

        const message = `Deleted order no. ${existingOrder.orderNumber}`;

        res.json({
          message,
        });
      }
    });
  } catch (error) {
    return next(error);
  }
};
