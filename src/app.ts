import express, { Express } from "express";
import { usersRouter, loginRouter, productsRouter } from "./routes";
import { errorHandler } from "@utils/errorHandler";

const app: Express = express();

app.use(express.json());
app.use(usersRouter);
app.use(productsRouter);
app.use(loginRouter);
app.use(errorHandler);

export default app;