export interface IAboutMeTranslation {
  id: string;
  name: string;
  about: string;
  role: string;
  country: string;
  city: string;
  languageCode: string;
  aboutMeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAboutMe {
  id: string;
  image: string;
  experience: string;
  age: string;
  projectNum: string;
  translations: IAboutMeTranslation[];
  createdAt: string;
  updatedAt: string;
}

export interface IAboutMeResponse {
  findFirstAboutMe: IAboutMe;
}

export interface AboutMeInitialValues {
  image: string | null;
  experience: string;
  age: string;
  projectNum: string;
  enName: string | undefined;
  kaName: string | undefined;
  enAbout: string | undefined;
  kaAbout: string | undefined;
  enRole: string | undefined;
  kaRole: string | undefined;
  enCountry: string | undefined;
  kaCountry: string | undefined;
  enCity: string | undefined;
  kaCity: string | undefined;
}
