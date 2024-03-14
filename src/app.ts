import express, { Express } from "express";
import { usersRouter } from "./routes";

const app: Express = express();

app.use(express.json())
app.use(usersRouter);

export default app;