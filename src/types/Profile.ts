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

export interface ProfileInitialValues {
  image: string | null;
  resume: string | null;
  age: string | undefined;
  mail: string | undefined;
  enName: string | undefined;
  kaName: string | undefined;
  enSurname: string | undefined;
  kaSurname: string | undefined;
  enProfession: string | undefined;
  kaProfession: string | undefined;
  enLocation: string | undefined;
  kaLocation: string | undefined;
  enExperience: string | undefined;
  kaExperience: string | undefined;
  enUniversity: string | undefined;
  kaUniversity: string | undefined;
  enUniversityAbout: string | undefined;
  kaUniversityAbout: string | undefined;
  enAboutMe: string | undefined;
  kaAboutMe: string | undefined;
}
