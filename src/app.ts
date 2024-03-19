import express, { Express } from "express";
import { usersRouter, loginRouter, productsRouter } from "./routes";
import { errorHandler } from "@utils/errorHandler";
import cors from 'cors';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(usersRouter);
app.use(productsRouter);
app.use(loginRouter);
app.use(errorHandler);

export default app;