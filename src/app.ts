import express, { Express } from "express";
import { usersRouter } from "./routes";

const app: Express = express();

app.use(usersRouter);

export default app;