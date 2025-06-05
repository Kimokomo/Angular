import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Book } from '../models/book.model';
import { BuchPage } from '../models/bookpage.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  //private apiUrl = 'http://91.99.135.252/api/books';
  private apiUrl = 'https://slicy.it.com/api/books';


  constructor(private http: HttpClient) { }

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  addBook(book: Book): Observable<void> {
    return this.http.post<void>(this.apiUrl, book);
  }

  updateBook(book: Book) {
    return this.http.put(`https://slicy.it.com/api/books/${book.id}`, book);
  }

  getBooksPaginated(page: number, size: number): Observable<BuchPage> {
    return this.http.get<BuchPage>(`${this.apiUrl}/superadmin/paginated/${page}/${size}`);
  }
}
