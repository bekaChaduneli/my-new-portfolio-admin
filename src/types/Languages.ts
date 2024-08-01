export interface ILanguagesTranslation {
  id: string;
  languageCode: string;
  name: string;
  description: string;
  level: string;
  languagesId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ILanguages {
  id: string;
  aboutMeId: string;
  translations: ILanguagesTranslation[];
  createdAt: string;
  updatedAt: string;
}

export interface ILanguagesResponse {
  findManyLanguages: ILanguages;
}

export interface LanguagesInitialValues {
  enName: string | undefined;
  kaName: string | undefined;
  enLevel: string | undefined;
  kaLevel: string | undefined;
  enDescription: string | undefined;
  kaDescription: string | undefined;
}
