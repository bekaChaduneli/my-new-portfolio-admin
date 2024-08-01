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
