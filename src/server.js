import express from "express";
import morgan from "morgan";

// Server is required as Heroku requires application to listen to
// $PORT env variable. Heroku will close the application otherwise.
export default class Server {
    constructor(port, environment) {
        this.app = express();
        this.port = port;

        const logFormat = environment === "production" ? "common" : "dev";
        this.app.use(morgan(logFormat));

        // Generic endpoint for uptime robot to send request to
        // Ensures application is kept 'hot'
        this.app.get("/", (req, res) => {
            res.send("hello world");
        });
    }

    start() {
        this.app.listen(this.port);
    }
}
