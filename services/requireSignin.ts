import "./passport";
import passport from "passport";

export const requireSignin = passport.authenticate("local", { session: false });
