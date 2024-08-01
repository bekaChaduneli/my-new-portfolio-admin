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

export interface EducationsInitialValues {
  link: string | undefined;
  fromDate: string | undefined;
  toDate: string | undefined;
  enName: string | undefined;
  kaName: string | undefined;
  enDegree: string | undefined;
  kaDegree: string | undefined;
  enFieldOfStudy: string | undefined;
  kaFieldOfStudy: string | undefined;
  enGpa: string | undefined;
  kaGpa: string | undefined;
  enDescription: string | undefined;
  kaDescription: string | undefined;
}
