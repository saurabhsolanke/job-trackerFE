import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationNote } from '../models/note.model';
import { PageResponse } from '../models/application.model';

@Injectable({ providedIn: 'root' })
export class NoteService {
  private readonly API_URL = 'http://localhost:8080/api/applications';

  constructor(private http: HttpClient) {}

  getNotes(
    applicationId: number,
    page: number = 0,
    size: number = 20
  ): Observable<PageResponse<ApplicationNote>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageResponse<ApplicationNote>>(`${this.API_URL}/${applicationId}/notes`, { params });
  }

  addNote(applicationId: number, note: ApplicationNote): Observable<ApplicationNote> {
    return this.http.post<ApplicationNote>(`${this.API_URL}/${applicationId}/notes`, note);
  }

  deleteNote(applicationId: number, noteId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${applicationId}/notes/${noteId}`);
  }
}
