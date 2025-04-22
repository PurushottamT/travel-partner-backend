import { IUser, Role } from "../../models/User";

declare global {
  namespace Express {
    interface Request {
      currentUser?: {
        id: string;
        role: IUser[Role];
      };
    }
  }
}
