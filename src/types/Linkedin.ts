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

export interface ILinkedin {
  id: string;
  image: string;
  banner: string;
  link: string;
  translations: ILinkedinTranslation[];
  createdAt: string;
  updatedAt: string;
}

export interface ILinkedinResponse {
  findFirstLinkedin: ILinkedin;
}
