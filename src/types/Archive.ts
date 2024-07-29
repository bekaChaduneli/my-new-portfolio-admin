export interface IArchiveTranslation {
  id: string;
  languageCode: string;
  description: string;
  name: string;
  markdown: string;
  location: string;
}

export interface IArchive {
  id: string;
  link: string;
  github: string;
  background: string;
  isReal: boolean;
  skills: string[];
  translations: IArchiveTranslation[];
}

export interface IArchivesResponse {
  archives: IArchive[];
}
