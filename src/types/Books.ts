// types/Books.ts
export interface BookTranslation {
  id: string;
  title: string;
  description: string;
  author: string;
  languageCode: string;
  booksId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Book {
  id: string;
  image: string;
  link: string;
  pages: string;
  readedPages: string;
  type: string;
  finished: boolean;
  translations: BookTranslation[];
}

export interface IBooksResponse {
  findManyBooks: Book[];
}
