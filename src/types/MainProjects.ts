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

export interface MainProjectsInitialValues {
  link: string | undefined;
  github: string | undefined;
  background: string | null;
  isReal: boolean;
  images: string[] | null;
  video: string[] | null;
  mobileBackgrounds: string[] | null;
  enName: string | undefined;
  enDescription: string | undefined;
  enMarkdown: string | undefined;
  enAbout: string | undefined;
  enLocation: string | undefined;
  kaName: string | undefined;
  kaDescription: string | undefined;
  kaMarkdown: string | undefined;
  kaAbout: string | undefined;
  kaLocation: string | undefined;
}
