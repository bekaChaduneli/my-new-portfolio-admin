export interface IHobbysTranslation {
  id: string;
  languageCode: string;
  aboutHobby: string;
  hobby: string;
  hobbysId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IHobbys {
  id: string;
  profileId: string;
  image: string;
  translations: IHobbysTranslation[];
  createdAt: string;
  updatedAt: string;
}

export interface IHobbysResponse {
  findManyHobbys: IHobbys;
}
