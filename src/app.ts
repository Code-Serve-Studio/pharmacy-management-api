import express, { Express, Request, Response, NextFunction } from "express";
import { usersRouter, loginRouter, productsRouter, uploadRouter, transactionsRouter, groupRouter, categoryRouter, masterDataRouter } from "./routes";
import { errorHandler } from "./utils/errorHandler";
import cors from 'cors';
import logger from '@utils/winstone';
import path from "path";
import rolesRouter from "@routes/roles/roles.router";
import analyticsRouter from "@routes/analytics/anallytics.router";

const app: Express = express();

app.use(cors());
app.use(express.json());
// Middleware to log all requests
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`Request received: ${req.method} ${req.url}`);
  next();
});

app.use('/src/public', express.static(path.join(__dirname, 'src/public')));
app.use(usersRouter);
app.use(productsRouter);
app.use(loginRouter);
app.use(uploadRouter);
app.use(transactionsRouter);
app.use(groupRouter);
app.use(categoryRouter);
app.use(rolesRouter);
app.use(analyticsRouter);
app.use(masterDataRouter);
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(errorHandler);

export default app;