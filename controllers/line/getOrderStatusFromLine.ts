import { Request, Response, NextFunction } from "express";
import { Order } from "../../models/order";
import { Line, LineAttrs } from "../../models/line";


export const getOrderStatusFromLine = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const lineDescription = req.params.lineDescription;
  console.log({lineDescription})
  if (!lineDescription) {
    res.status(422).send({
      error: "You must provide line id!",
    });
    return;
  }

  Line.find({ lineDescription }, function (err: Error, line: LineAttrs) {
    if (err) {
      next(err);
      return;
    }

    if (!line) {
      res.status(422).send({ error: "Line does not exist" });
      return;
    }

    const orderNumber = line.lineOccupiedWith;
    if (!orderNumber || orderNumber === "") {
      res.status(422).send({
        error: "Line is free!",
      });
      return;
    }

    Order.findOne(
      {
        orderNumber,
      },
      function (err, order) {
        if (err) {
          next(err);
          return;
        }
        if (!order) {
          res.status(422).send({ error: "Order does not exist" });
          return;
        }

        res.json(order);
      }
    );
  });
};
