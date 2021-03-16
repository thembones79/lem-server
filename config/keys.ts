export interface IKeys {
  dbConnectionString: string;
  dbAtlas: string;
  secret: string;
}

let keys: IKeys;

const getKeys = (): IKeys => {
  if (process.env.NODE_ENV === "production") {
    const prod = require("./prod").prod;
    return prod;
  } else {
    const dev = require("./dev").dev;
    return dev;
  }
};

keys = getKeys();
export { keys };
