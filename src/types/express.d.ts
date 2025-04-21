import { IUser } from "../models/Users";

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // or user?: { _id: string, role: string } etc.
      resource?: any; // if you want to pass the fetched resource to next middleware
    }
  }
}
