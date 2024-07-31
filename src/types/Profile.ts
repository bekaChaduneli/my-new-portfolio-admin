export interface IProfileTranslation {
  id: string;
  name: string;
  surname: string;
  profession: string;
  location: string;
  experience: string;
  university: string;
  universityAbout: string;
  aboutMe: string;
  languageCode: string;
  profileId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IProfile {
  id: string;
  age: string;
  resume: string;
  image: string;
  mail: string;
  translations: IProfileTranslation[];
  createdAt: string;
  updatedAt: string;
}

export interface IProfileResponse {
  findFirstProfile: IProfile;
}
