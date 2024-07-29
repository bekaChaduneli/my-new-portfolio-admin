export interface IBlog {
  id: string;
  link: string;
  background: string;
  translations: IBlogTranslation[];
}

export interface IBlogTranslation {
  id: string;
  languageCode: string;
  headline: string;
  about: string;
}

export interface IBlogsResponse {
  findManyBlogs: IBlog[];
}
