import { Router } from 'express';
import { PromptController } from '../controllers/prompt.controller';

const router = Router();
const controller = new PromptController();

router.post('/command-1', (req: any, res: any) => controller.generateCommand1(req, res));
router.post('/command-2', (req: any, res: any) => controller.generateCommand2(req, res));
router.post('/command-3', (req: any, res: any) => controller.generateCommand3(req, res));

export default router;
