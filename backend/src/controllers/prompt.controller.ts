import { Request, Response } from 'express';
import { PromptService } from '../services/prompt.service';

const promptService = new PromptService();

export class PromptController {
  public async generateCommand1(req: Request, res: Response): Promise<void> {
    try {
      const { masteredSkills, skillName, skillDescription } = req.body;
      if (!skillName || !skillDescription) {
        res.status(400).json({ error: 'skillName and skillDescription are required' });
        return;
      }

      const promptText = promptService.generateCommand1Prompt({
        masteredSkills,
        skillName,
        skillDescription,
      });

      res.json({ command: 1, promptText });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to generate Command 1 prompt' });
    }
  }

  public async generateCommand2(req: Request, res: Response): Promise<void> {
    try {
      const { skillName, sectionTitle, sectionTarget, sectionScope } = req.body;
      if (!skillName || !sectionTitle) {
        res.status(400).json({ error: 'skillName and sectionTitle are required' });
        return;
      }

      const promptText = promptService.generateCommand2Prompt({
        skillName,
        sectionTitle,
        sectionTarget: sectionTarget || 'Master section target',
        sectionScope: sectionScope || 'Section pedagogical scope',
      });

      res.json({ command: 2, promptText });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to generate Command 2 prompt' });
    }
  }

  public async generateCommand3(req: Request, res: Response): Promise<void> {
    try {
      const { skillName, sectionScope, topicTitle, milestoneIndex, totalMilestones, currentMilestoneContext } = req.body;
      if (!skillName || !topicTitle || milestoneIndex === undefined) {
        res.status(400).json({ error: 'skillName, topicTitle, and milestoneIndex are required' });
        return;
      }

      const promptText = promptService.generateCommand3Prompt({
        skillName,
        sectionScope: sectionScope || 'Scope context',
        topicTitle,
        milestoneIndex: Number(milestoneIndex),
        totalMilestones: totalMilestones ? Number(totalMilestones) : 5,
        currentMilestoneContext,
      });

      res.json({ command: 3, promptText });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to generate Command 3 prompt' });
    }
  }
}
