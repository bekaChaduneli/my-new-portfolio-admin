export interface IWorksTranslation {
  id: string;
  languageCode: string;
  company: string;
  role: string;
  description: string;
  location: string;
  locationType: string;
  employmentType: string;
  worksId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IWorks {
  id: string;
  aboutMeId: string;
  link: string;
  fromDate: string;
  toDate: string;
  translations: IWorksTranslation[];
  createdAt: string;
  updatedAt: string;
}

export interface IWorksResponse {
  findManyWorks: IWorks;
}

export interface WorksInitialValues {
  link: string | undefined;
  fromDate: string | undefined;
  toDate: string | undefined;
  enCompany: string | undefined;
  kaCompany: string | undefined;
  enRole: string | undefined;
  kaRole: string | undefined;
  enDescription: string | undefined;
  kaDescription: string | undefined;
  enLocation: string | undefined;
  kaLocation: string | undefined;
  enLocationType: string | undefined;
  kaLocationType: string | undefined;
  enEmploymentType: string | undefined;
  kaEmploymentType: string | undefined;
}
