import { IKeys } from "./keys";

export const prod: IKeys = {
  dbConnectionString: process.env.DB_CONNECTION_STRING!,
  dbAtlas: process.env.DB_ATLAS!,
  secret: process.env.SECRET!,
};
