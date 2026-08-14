import { Router } from 'express';
import { QuestController } from '../controllers/quest.controller';

const router = Router();
const controller = new QuestController();

router.get('/', controller.getQuests);
router.get('/:id', controller.getQuestById);
router.post('/', controller.createQuest);
router.put('/:id', controller.updateQuest);
router.delete('/:id', controller.deleteQuest);

export default router;
