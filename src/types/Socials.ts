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
