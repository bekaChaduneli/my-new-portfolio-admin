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
  markdown: string;
}

export interface IBlogsResponse {
  findManyBlogs: IBlog[];
}

export interface BlogsInitialValues {
  link: string | undefined;
  background: string | null;
  enHeadline: string | undefined;
  enAbout: string | undefined;
  enMarkdown: string | undefined;
  kaHeadline: string | undefined;
  kaAbout: string | undefined;
  kaMarkdown: string | undefined;
}
