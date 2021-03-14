import { Router, Request, Response, NextFunction } from "express";
import mongoose, { Types } from "mongoose";
import { Order } from "../models/order";
import { Line, LineAttrs } from "../models/line";
import { Product } from "../models/product";

const ObjectId = Types.ObjectId;

export const addLine = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const lineNumber = parseInt(req.body.lineNumber, 10);

  if (!lineNumber) {
    res.status(422).send({
      error: "You must provide line number",
    });
    return;
  }

  // See if a line with given number exists
  Line.findOne({ lineNumber }, function (err, existingLine) {
    if (err) {
      return next(err);
    }

    // If line exists, return an error
    if (existingLine) {
      return res.status(422).send({ error: "Line already exists" });
    }

    // If line does not exist, create and save line record
    const line = new Line({
      lineNumber,
    });

    line.save(function (err) {
      if (err) {
        return next(err);
      }
      const message = `Created line no. ${line.lineNumber}`;
      // Respond to request indicating the user was created
      res.json({
        message,
      });
    });
  });
};

export const getLines = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  Line.find({}, function (err, lines) {
    if (err) {
      next(err);
      return;
    }
    res.json({
      lines,
    });
  });
};

export const changeStatus = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const lineId = req.body.lineId;
  const lineStatus: string = req.body.lineStatus;

  if (!lineId || !lineStatus) {
    res.status(422).send({
      error: "You must provide line number and line status!",
    });
    return;
  }

  Line.findOne({ _id: lineId }, function (err, existingLine) {
    if (err) {
      next(err);
      return;
    }

    if (!existingLine) {
      res.status(422).send({ error: "Line does not exist!" });
      return;
    }

    existingLine.lineStatus = lineStatus;

    existingLine.save(function (err) {
      if (err) {
        next(err);
        return;
      }
      const message = `Updated line with id: ${existingLine._id} status to: ${existingLine.lineStatus}`;
      // Respond to request indicating the user was created
      res.json({
        message,
      });
    });
  });
};

export const occupyLineWith = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const {
    lineId,
    orderNumber,
  }: { lineId: string; orderNumber: string } = req.body;

  if (!lineId || !orderNumber) {
    res.status(422).send({
      error: "You must provide line number and order number!",
    });
    return;
  }

  Line.findById(lineId, function (err, existingLine) {
    if (err) {
      next(err);
      return;
    }

    if (!existingLine) {
      res.status(422).send({ error: "Line does not exist!" });
      return;
    }

    existingLine.lineOccupiedWith = orderNumber;

    existingLine.save(function (err) {
      if (err) {
        next(err);
        return;
      }
      const message = `Updated line: ${existingLine.lineDescription}, with order: ${existingLine.lineOccupiedWith}.`;
      // Respond to request indicating the user was created
      res.json({
        message,
      });
    });
  });
};

export const getProductFromLine = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const _id = req.params._id;
  if (!_id) {
    res.status(422).send({
      error: "You must provide line id!",
    });
    return;
  }

  if (!ObjectId.isValid(_id)) {
    res.status(422).send({
      error: "Invalid id!",
    });
    return;
  }

  Line.findById(_id, function (err: Error, line: LineAttrs) {
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

        const { partNumber } = order;

        Product.findOne({ partNumber })
          .populate("linksToRedirs")
          .exec(function (err, existingProduct) {
            if (err) {
              console.log({ err });
              next(err);
              return;
            }
            if (!existingProduct) {
              res.status(422).send({ error: "Product does not exist!" });
              return;
            }
            res.json({ existingProduct, orderNumber });
          });
      }
    );
  });
};
