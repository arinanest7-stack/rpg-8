import { QuestRepository } from '../repositories/quest.repository';
import { CreateQuestInput, UpdateQuestInput } from '../dtos/quest.dto';

export class QuestService {
  constructor(private questRepo: QuestRepository = new QuestRepository()) {}

  async getQuests(tenantId: string) {
    return this.questRepo.findAllByTenant(tenantId);
  }

  async getQuestById(id: string, tenantId: string) {
    const quest = await this.questRepo.findByIdAndTenant(id, tenantId);
    if (!quest) {
      throw new Error('Quest not found');
    }
    return quest;
  }

  async createQuest(data: CreateQuestInput) {
    return this.questRepo.create(data);
  }

  async updateQuest(id: string, tenantId: string, data: UpdateQuestInput) {
    await this.getQuestById(id, tenantId);
    await this.questRepo.update(id, tenantId, data);
    return this.getQuestById(id, tenantId);
  }

  async deleteQuest(id: string, tenantId: string) {
    await this.getQuestById(id, tenantId);
    return this.questRepo.delete(id, tenantId);
  }
}
