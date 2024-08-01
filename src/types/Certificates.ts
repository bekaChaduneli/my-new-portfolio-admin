export interface ICertificatesTranslation {
  id: string;
  languageCode: string;
  name: string;
  organization: string;
  description: string;
  certificatesId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICertificates {
  id: string;
  aboutMeId: string;
  link: string;
  image: string;
  issueDate: string;
  expirationDate: string;
  translations: ICertificatesTranslation[];
  createdAt: string;
  updatedAt: string;
}

export interface ICertificatesResponse {
  findManyCertificates: ICertificates;
}
