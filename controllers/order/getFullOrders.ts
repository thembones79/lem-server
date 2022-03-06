import { Request, Response, NextFunction } from "express";
import { Order } from "../../models/order";
import { Stream } from "stream";

export const getFullOrders = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Order.find().cursor({ transform: JSON.stringify }).pipe(res.type("json"));
  // Order.find()
  //   .cursor() //@ts-ignore
  //   .map((x: any) => x + ", ")
  //   .pipe(res.type("json"));

  if ("HEAD" == req.method) return res.end();

  // output json
  res.contentType("json");

  // use our lame formatter
  //@ts-ignore
  var format = new ArrayFormatter();

  // first pipe the querystream to the formatter
  //@ts-ignore
  Order.find().stream().pipe(format);

  // then pipe the formatter to the response
  // (node 0.4x style pipe non-chaining)
  format.pipe(res);

  // In node 0.6 we can P.find().stream().pipe(format).pipe(res);
};

/**
 * A hacked querystream formatter which formats the output
 * as a json literal. Not production quality.
 */
//ts
function ArrayFormatter() {
  //@ts-ignore
  Stream.call(this);
  //@ts-ignore
  this.writable = true;
  //@ts-ignore
  this._done = false;
}

ArrayFormatter.prototype.__proto__ = Stream.prototype;

//@ts-ignore
ArrayFormatter.prototype.write = function (doc) {
  if (!this._hasWritten) {
    this._hasWritten = true;

    // open an object literal / array string along with the doc
    this.emit("data", "[" + JSON.stringify(doc));
  } else {
    this.emit("data", "," + JSON.stringify(doc));
  }

  return true;
};

ArrayFormatter.prototype.end = ArrayFormatter.prototype.destroy = function () {
  if (this._done) return;
  this._done = true;

  // close the object literal / array
  this.emit("data", "]");
  // done
  this.emit("end");
};
