export interface IGithubRepo {
  id: string;
  link: string;
  stars: string;
  language: string;
  translations: IGithubRepoTranslation[];
  createdAt: string;
  updatedAt: string;
}

export interface IGithubRepoTranslation {
  id: string;
  title: string;
  description: string;
  languageCode: string;
  githubReposId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateGithubRepoInput {
  link: string;
  stars: string;
  language: string;
  translations: ICreateGithubRepoTranslationInput[];
}

export interface ICreateGithubRepoTranslationInput {
  title: string;
  description: string;
  languageCode: string;
}

export interface IUpdateGithubRepoInput {
  link?: string;
  stars?: string;
  language?: string;
  translations?: IUpdateGithubRepoTranslationInput[];
}

export interface IUpdateGithubRepoTranslationInput {
  id: string;
  title?: string;
  description?: string;
}
