import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import env from "./config/env.config";

const app = express();

app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Backend is running!");
});

export default app;
