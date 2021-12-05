import { Express } from "express";
import { breakRouter } from "./breakRouter";
import { authentication } from "./authentication";
import { lineRouter } from "./lineRouter";
import { liveViewRouter } from "./liveViewRouter";
import { menuRouter } from "./menuRouter";
import { orderRouter } from "./orderRouter";
import { productRouter } from "./productRouter";
import { redirectionRouter } from "./redirectionRouter";
import { userRouter } from "./userRouter";
import { partnumberConfigRouter } from "./partnumberConfigRouter";

export default (app: Express) => {
  breakRouter(app);
  authentication(app);
  lineRouter(app);
  liveViewRouter(app);
  menuRouter(app);
  orderRouter(app);
  productRouter(app);
  redirectionRouter(app);
  userRouter(app);
  partnumberConfigRouter(app);
};
