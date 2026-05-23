import express, { Express, Request, Response } from "express";
import cors from "cors";
import categoryRoutes from "./routes/category.routes";
import projectRoutes from "./routes/project.routes";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";

const app: Express = express();

const AllowedOrigins = ["http://localhost:5173"];

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    if (!origin || AllowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Body:`, req.body);
  next();
});

app.use("/api/category", categoryRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

export default app;
