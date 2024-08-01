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
