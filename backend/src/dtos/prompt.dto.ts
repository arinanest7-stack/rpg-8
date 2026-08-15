export interface Command1RequestDto {
  masteredSkills?: string;
  skillName: string;
  skillDescription: string;
}

export interface Command2RequestDto {
  skillName: string;
  sectionTitle: string;
  sectionTarget: string;
  sectionScope: string;
}

export interface Command3RequestDto {
  skillName: string;
  sectionScope: string;
  topicTitle: string;
  milestoneIndex: number;
  totalMilestones?: number;
  currentMilestoneContext?: string;
}
