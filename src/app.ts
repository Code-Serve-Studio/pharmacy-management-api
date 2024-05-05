import express, { Express, Request, Response, NextFunction } from "express";
import { usersRouter, loginRouter, productsRouter } from "./routes";
import { errorHandler } from "./utils/errorHandler";
import cors from 'cors';
import logger from '@utils/winstone';

const app: Express = express();

app.use(cors());
app.use(express.json());
// Middleware to log all requests
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`Request received: ${req.method} ${req.url}`);
  next();
});
app.use(usersRouter);
app.use(productsRouter);
app.use(loginRouter);
app.use(errorHandler);

export default app;