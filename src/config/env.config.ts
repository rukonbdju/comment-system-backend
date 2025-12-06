import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
    NODE_ENV: "development" | "production" | "test";
    PORT: number;
    MONGO_URI: string;

    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    ACCESS_TOKEN_EXPIRES_IN: string;
    REFRESH_TOKEN_EXPIRES_IN: string;

    FRONTEND_URL: string;
}

const env: EnvConfig = {
    NODE_ENV: (process.env.NODE_ENV as EnvConfig["NODE_ENV"]) || "development",
    PORT: Number(process.env.PORT || "5000"),
    MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/myapp",

    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "access-secret",
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "refresh-secret",
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || "3600",
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || "604800",

    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
};

export default env;
