export interface IBooksResponse {
  findManyBooks: IBook[];
}

export interface IBook {
  id: string;
  image: string;
  link: string;
  pages: string;
  readedPages: string;
  type: string;
  finished: boolean;
  releaseDate: any;
  index: string;
  translations: IBookTranslation[];
}

export interface IBookTranslation {
  id: string;
  title: string;
  description: string;
  author: string;
  languageCode: string;
  booksId: string;
  createdAt: any;
  updatedAt: any;
}
