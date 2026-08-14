import { z } from 'zod';

export const CreateQuestDTO = z.object({
  tenantId: z.string().min(1, 'Tenant ID is required'),
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  category: z.string().optional().default('Core Lore'),
  difficulty: z.string().optional().default('Medium'),
  rewardXp: z.number().int().nonnegative().optional().default(100),
  rewardGold: z.number().int().nonnegative().optional().default(50),
});

export const UpdateQuestDTO = CreateQuestDTO.partial().omit({ tenantId: true });

export type CreateQuestInput = z.infer<typeof CreateQuestDTO>;
export type UpdateQuestInput = z.infer<typeof UpdateQuestDTO>;
