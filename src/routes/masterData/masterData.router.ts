import express from 'express';
import { getUnits } from './masterData.controller';

const masterDataRouter = express.Router();

masterDataRouter.get('/api/master-data/units', getUnits);

export default masterDataRouter;