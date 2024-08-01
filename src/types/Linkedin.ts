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

export interface LinkedinInitialValues {
  image: string | null;
  banner: string | null;
  link: string | undefined;
  enName: string | undefined;
  enBio: string | undefined;
  enCompany: string | undefined;
  enUniversity: string | undefined;
  kaName: string | undefined;
  kaBio: string | undefined;
  kaCompany: string | undefined;
  kaUniversity: string | undefined;
}
