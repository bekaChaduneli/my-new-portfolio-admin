export interface ISocials {
  id: string;
  profileId: string;
  name: string;
  link: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISocialsResponse {
  findManySocials: ISocials;
}

export interface SocialsInitialValues {
  name: string | undefined;
  link: string | undefined;
}
