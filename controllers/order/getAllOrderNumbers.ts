import { Order } from "../../models/order";

export const getAllOrderNumbers = () =>
  Order.find({}, "orderNumber ")
    .distinct("orderNumber")
    .exec(async (err, orders) => {
      if (err) {
        return console.log(err);
      }

      console.log({
        Y: orders,
      });

      return orders;
    });
