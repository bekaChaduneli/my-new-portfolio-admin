export interface IServicesTranslation {
  id: string;
  languageCode: string;
  servicesId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface IServices {
  id: string;
  background?: string;
  order: string;
  translations: IServicesTranslation[];
  createdAt: string;
  updatedAt: string;
}

export interface IServicesResponse {
  findManyServices: IServices;
}
