import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import userRoutes from "./routes/userRoutes";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, //15 min
    max: 100, //Limiting each IP address for 100 request per windows
    message: "Too many attempts please try again later",
  })
);
app.use("/api/users", userRoutes);
app.get("/", (req: express.Request, res: express.Response) => {
  res.send("API is running...");
});
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
