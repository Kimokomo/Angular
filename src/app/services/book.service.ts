import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Book } from '../models/book.model';
import { BuchPage } from '../models/bookpage.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  static readonly API_URL = `${environment.apiBaseUrl}`;

  private apiUrl = `${environment.apiBaseUrl}/books`;


  constructor(private http: HttpClient) { }

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  addBook(book: Book): Observable<void> {
    return this.http.post<void>(this.apiUrl, book);
  }

  updateBook(book: Book) {
    return this.http.put(`${this.apiUrl}/${book.id}`, book);
  }

  getBooksPaginated(page: number, size: number): Observable<BuchPage> {
    return this.http.get<BuchPage>(`${this.apiUrl}/superadmin/paginated/${page}/${size}`);
  }
}
