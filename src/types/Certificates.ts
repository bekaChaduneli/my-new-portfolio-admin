export interface ICertificatesTranslation {
  id: string;
  languageCode: string;
  name: string;
  organiation: string;
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

export interface CertificatesInitialValues {
  link: string | undefined;
  issueDate: string | undefined;
  expirationDate: string | undefined;
  enName: string | undefined;
  kaName: string | undefined;
  enOrganization: string | undefined;
  kaOrganization: string | undefined;
  enDescription: string | undefined;
  kaDescription: string | undefined;
}
