export interface UserPayload {
  _id: string;
  role: "super_admin" | "travel_agent" | "vehicle_agent" | "guide" | "user";
}
