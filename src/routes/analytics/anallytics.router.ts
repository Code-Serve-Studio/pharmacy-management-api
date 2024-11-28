import express from "express";
import { getAnalyticsDashboard } from "./analytics.controller";

const analyticsRouter = express.Router();

analyticsRouter.get('/api/analytics/dashboard', getAnalyticsDashboard);

export default analyticsRouter;