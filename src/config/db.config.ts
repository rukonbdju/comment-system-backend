import mongoose from "mongoose";
import logger from "../utils/logger";
import env from "./env.config";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(env.MONGO_URI || "");
        logger.info(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        logger.error(`MongoDB connection error: ${error}`);
        //process.exit(1);
    }
};

export default connectDB;
