// @flow
import type { $Request, $Response, express$Application } from "express";
import express from "express";
import morgan from "morgan";

// Server is required as Heroku requires application to listen to
// $PORT env variable. Heroku will close the application otherwise.
export default class Server {
    app: express$Application;

    port: string;

    constructor(port: string, environment: string) {
        this.app = express();
        this.port = port;

        const logFormat = environment === "production" ? "common" : "dev";
        this.app.use(morgan(logFormat));

        // Generic endpoint for uptime robot to send request to
        // Ensures application is kept 'hot'
        this.app.get("/", (req: $Request, res: $Response) => {
            res.send("hello world");
        });
    }

    start(): void {
        this.app.listen(this.port);
    }
}
