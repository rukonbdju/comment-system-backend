import express from "express";
import { createServer } from 'http';
import { initWsServer } from './websocket/ws.server';
import cors from "cors";
import cookieParser from "cookie-parser";
import env from "./config/env.config";
import { errorHandler } from "./middlewares/error.middleware";
import router from "./router";

const app = express();

const httpServer = createServer(app);

app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());


app.use('/api', router);

app.get("/", (req, res) => {
    res.send("Backend is running!");
});

initWsServer(httpServer);

app.use(errorHandler)

export default httpServer;
