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

export interface BooksInitialValues {
  id: string | undefined;
  image: string | null;
  link: string | undefined;
  pages: string | undefined;
  readedPages: string | undefined;
  type: string | undefined;
  finished: boolean;
  enTitle: string | undefined;
  enDescription: string | undefined;
  enAuthor: string | undefined;
  kaTitle: string | undefined;
  kaDescription: string | undefined;
  kaAuthor: string | undefined;
}
