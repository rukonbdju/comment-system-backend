import app from "./app";
import connectDB from "./config/db.config";
import logger from "./utils/logger";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`)
    });
};

startServer();