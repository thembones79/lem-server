const Auhentication = require("./controllers/authentication");
const LineController = require("./controllers/line");
const UserController = require("./controllers/user");
const OrderController = require("./controllers/order");
const ScanController = require("./controllers/scan");
const passportService = require("./services/passport");
const passport = require("passport");

const requireAuth = passport.authenticate("jwt", { session: false });
const requireSignin = passport.authenticate("local", { session: false });

module.exports = function (app) {
  app.get("/", requireAuth, function (req, res) {
    res.send({
      message: "-- this is a secret message stright from the server, really",
      user: req.user,
    });
  });
  app.post("/signin", requireSignin, Auhentication.signin);
  app.post("/signup", Auhentication.signup);
  app.post("/api/line", requireAuth, LineController.addLine);
  app.get("/api/lines", requireAuth, LineController.getLines);
  app.post("/api/user", requireAuth, UserController.addUser);
  app.post("/api/order", requireAuth, OrderController.addOrder);
  app.post("/api/scan", requireAuth, ScanController.addScan);
};
