import { Component } from '@angular/core';
import { Book } from '../models/book.model';
import { BookService } from '../services/book.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-books-list',
  standalone:true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './books-list.component.html',
  styleUrl: './books-list.component.css'
})
export class BooksListComponent {
 books: Book[] = [];

  displayedBooks: Book[] = [];

  totalBooks: number = 0;

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  totalPagesArray: number[] = [];

  newBook: Book = {
    titel: '',
    autor: '',
    erscheinungsjahr: new Date().getFullYear(),
    verfuegbar: ''
  };

  editBookId: number | null = null;
  editBook: Book = {} as Book;

  constructor(private bookService: BookService, private http: HttpClient) { }

  ngOnInit(): void {
    this.loadPage(this.currentPage);
  }

  loadPage(page: number) {
    this.bookService.getBooksPaginated(page, this.pageSize).subscribe(data => {
      this.displayedBooks = data.content;
      this.currentPage = data.page;
      this.totalPages = data.totalPages;
      this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    });
  }


  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.loadPage(page);
  }

  addBook(): void {
    this.bookService.addBook(this.newBook).subscribe(() => {
      this.newBook = {
        titel: '',
        autor: '',
        erscheinungsjahr: new Date().getFullYear(),
        verfuegbar: ''
      };
      this.loadPage(this.currentPage);
    });
  }

  deleteBook(id: number) {
    if (confirm('Möchten Sie dieses Buch wirklich löschen?')) {
      this.http.delete(`http://localhost:8080/api/books/${id}`).subscribe(() => {
        // Buch aus der aktuell angezeigten Seite entfernen
        this.displayedBooks = this.displayedBooks.filter(b => b.id !== id);

        // Optional: Seite neu laden, falls du die aktuelle Seitenzahl anpassen willst (z.B. wenn die Seite nach löschen leer wird)
        this.loadPage(this.currentPage);
      }, error => {
        alert('Fehler beim Löschen des Buchs.');
      });
    }
  }

  startEdit(book: Book) {
    this.editBookId = book.id!;
    this.editBook = { ...book }; // Kopie machen, damit nicht direkt die Liste geändert wird
  }

  saveEdit() {
    if (confirm('Möchten Sie die Änderungen wirklich speichern?')) {
      this.bookService.updateBook(this.editBook).subscribe(() => {
        const index = this.displayedBooks.findIndex(b => b.id === this.editBook.id);
        if (index !== -1) {
          this.displayedBooks[index] = { ...this.editBook };
        }
        this.editBookId = null;
      });
    }
  }

  cancelEdit() {
    this.editBookId = null;
  }

}
