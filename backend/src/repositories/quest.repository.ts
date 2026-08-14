import { prisma } from '../lib/prisma';
import { CreateQuestInput, UpdateQuestInput } from '../dtos/quest.dto';

export class QuestRepository {
  async findAllByTenant(tenantId: string) {
    return prisma.quest.findMany({
      where: { tenantId },
      include: { steps: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByIdAndTenant(id: string, tenantId: string) {
    return prisma.quest.findFirst({
      where: { id, tenantId },
      include: { steps: true },
    });
  }

  async create(data: CreateQuestInput) {
    return prisma.quest.create({
      data: {
        tenantId: data.tenantId,
        title: data.title,
        description: data.description,
        category: data.category ?? 'Core Lore',
        difficulty: data.difficulty ?? 'Medium',
        rewardXp: data.rewardXp ?? 100,
        rewardGold: data.rewardGold ?? 50,
      },
      include: { steps: true },
    });
  }

  async update(id: string, tenantId: string, data: UpdateQuestInput) {
    return prisma.quest.updateMany({
      where: { id, tenantId },
      data,
    });
  }

  async delete(id: string, tenantId: string) {
    return prisma.quest.deleteMany({
      where: { id, tenantId },
    });
  }
}
