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

export interface ArchiveInitialValues {
  link: string | undefined;
  github: string | undefined;
  background: string | null;
  isReal: boolean;
  enName: string | undefined;
  enDescription: string | undefined;
  enLocation: string | undefined;
  kaName: string | undefined;
  kaDescription: string | undefined;
  kaLocation: string | undefined;
}
