export interface IEducationsTranslation {
  id: string;
  languageCode: string;
  name: string;
  degree: string;
  fieldOfStudy: string;
  gpa: string;
  description: string;
  educationsId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IEducations {
  id: string;
  aboutMeId: string;
  link: string;
  fromDate: string;
  toDate: string;
  translations: IEducationsTranslation[];
  createdAt: string;
  updatedAt: string;
}

export interface IEducationsResponse {
  findManyEducations: IEducations;
}
