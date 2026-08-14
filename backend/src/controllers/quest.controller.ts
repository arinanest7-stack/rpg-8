import { Request, Response } from 'express';
import { QuestService } from '../services/quest.service';
import { CreateQuestDTO, UpdateQuestDTO } from '../dtos/quest.dto';

export class QuestController {
  constructor(private questService: QuestService = new QuestService()) {}

  getQuests = async (req: Request, res: Response): Promise<void> => {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || 'default-tenant';
      const quests = await this.questService.getQuests(tenantId);
      res.json({ success: true, data: quests });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getQuestById = async (req: Request, res: Response): Promise<void> => {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || 'default-tenant';
      const quest = await this.questService.getQuestById(req.params.id, tenantId);
      res.json({ success: true, data: quest });
    } catch (error: any) {
      res.status(404).json({ success: false, error: error.message });
    }
  };

  createQuest = async (req: Request, res: Response): Promise<void> => {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || 'default-tenant';
      const validatedData = CreateQuestDTO.parse({ ...req.body, tenantId });
      const newQuest = await this.questService.createQuest(validatedData);
      res.status(201).json({ success: true, data: newQuest });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  updateQuest = async (req: Request, res: Response): Promise<void> => {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || 'default-tenant';
      const validatedData = UpdateQuestDTO.parse(req.body);
      const updated = await this.questService.updateQuest(req.params.id, tenantId, validatedData);
      res.json({ success: true, data: updated });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  deleteQuest = async (req: Request, res: Response): Promise<void> => {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || 'default-tenant';
      await this.questService.deleteQuest(req.params.id, tenantId);
      res.json({ success: true, message: 'Quest deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };
}
