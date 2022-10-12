import { Request, Response, NextFunction } from "express";
import { Order } from "../../models/order";
import { Line, LineAttrs } from "../../models/line";

export const getOrderStatusFromLine = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const lineDescription = req.params.lineDescription;
  if (!lineDescription) {
    res.status(422).send({
      error: "You must provide line id!",
    });
    return;
  }

  Line.find({ lineDescription }, function (err: Error, line: LineAttrs[]) {
    if (err) {
      next(err);
      return;
    }

    if (!line.length) {
      res.status(422).send({ error: "Line does not exist" });
      return;
    }

    const orderNumber = line[0]?.lineOccupiedWith;
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

        const { breaks, orderNumber, orderStatus, scans } = order;

        const isOrderRunning = () => {
          if (scans && !breaks) return true;
          if (!scans) return false;
          if (
            scans &&
            breaks.length > 0 &&
            breaks[breaks.length - 1].breakEnd
          ) {
            return true;
          }
          return false;
        };

        const getExactOrderStatus = () => {
          if (orderStatus === "closed") return orderStatus;
          if (!scans) return "before start";
          if (isOrderRunning()) return "in progress";
          return "paused";
        };

        res.json({
          orderStatus: getExactOrderStatus(),
          orderNumber,
          line: lineDescription,
        });
      }
    );
  });
};
