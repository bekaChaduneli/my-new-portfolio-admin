export interface ISkillsTranslation {
  id: string;
  languageCode: string;
  skillsId: string;
  name: string;
  about: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISkills {
  id: string;
  link: string;
  color: string;
  image?: string;
  translations: ISkillsTranslation[];
  createdAt: string;
  updatedAt: string;
}

export interface ISkillsResponse {
  findManySkills: ISkills;
}
