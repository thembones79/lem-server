import { prod } from "./prod";
import { dev } from "./dev";

export interface IKeys {
  dbConnectionString: string;
  dbAtlas: string;
  secret: string;
}

export const keys: IKeys = process.env.NODE_ENV === "production" ? prod : dev;
