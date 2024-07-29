export interface ILinkedin {
  id: string;
  image: string;
  banner: string;
  link: string;
  translations: ILinkedinTranslation[];
  posts: IPosts[];
  topSkills: ITopSkills[];
  createdAt: string;
  updatedAt: string;
}

export interface ILinkedinTranslation {
  id: string;
  name: string;
  bio: string;
  company: string;
  university: string;
  languageCode: string;
  linkedinId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPosts {
  id: string;
  linkedinId: string;
  image?: string;
  likes: number; // Changed to number
  commentsSum: number; // Changed to number
  link: string;
  translations: IPostsTranslation[];
  createdAt: string;
  updatedAt: string;
}

export interface IPostsTranslation {
  id: string;
  linkedinName: string;
  languageCode: string;
  description: string;
  postsId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITopSkills {
  id: string;
  linkedinId: string;
  translations: ITopSkillsTranslation[];
  createdAt: string;
  updatedAt: string;
}

export interface ITopSkillsTranslation {
  id: string;
  linkedinName: string;
  languageCode: string;
  name: string;
  topSkillsId: string;
  createdAt: string;
  updatedAt: string;
}
