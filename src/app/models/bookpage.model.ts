import { Book } from "./book.model";

export interface BuchPage {
  content: Book[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}