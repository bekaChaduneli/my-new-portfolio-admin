export interface IMainProjectsTranslation {
  id: string;
  languageCode: string;
  description: string;
  name: string;
  markdown: string;
  about: string;
  location: string;
}

export interface IMainProjects {
  id: string;
  link: string;
  github: string;
  background: string;
  images: string[];
  video: string[];
  mobileBackgrounds: string[];
  skills: string[];
  isReal: boolean;
  translations: IMainProjectsTranslation[];
}

export interface IMainProjectsResponse {
  findManyMainProjects: IMainProjects[];
}
