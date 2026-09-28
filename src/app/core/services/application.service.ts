import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobApplication, PageResponse, ApplicationStatus } from '../models/application.model';

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  private readonly API_URL = 'http://localhost:8080/api/applications';

  constructor(private http: HttpClient) {}

  getApplications(
    page: number = 0,
    size: number = 10,
    status?: ApplicationStatus
  ): Observable<PageResponse<JobApplication>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<PageResponse<JobApplication>>(this.API_URL, { params });
  }

  getApplicationById(id: number): Observable<JobApplication> {
    return this.http.get<JobApplication>(`${this.API_URL}/${id}`);
  }

  createApplication(app: JobApplication): Observable<JobApplication> {
    return this.http.post<JobApplication>(this.API_URL, app);
  }

  updateApplication(id: number, app: JobApplication): Observable<JobApplication> {
    return this.http.put<JobApplication>(`${this.API_URL}/${id}`, app);
  }

  deleteApplication(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
