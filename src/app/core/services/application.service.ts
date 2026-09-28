import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JobApplication, PageResponse, ApplicationStatus } from '../models/application.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  private readonly API_URL = `${environment.apiUrl}/applications`;

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

    return this.http.get<any>(this.API_URL, { params }).pipe(
      map((res) => {
        if (Array.isArray(res)) {
          return {
            content: res,
            totalElements: res.length,
            totalPages: Math.ceil(res.length / size) || 1,
            size: size,
            number: page
          };
        }
        if (res && Array.isArray(res.content)) {
          return res;
        }
        if (res && Array.isArray(res.data)) {
          const total = res.total ?? res.totalElements ?? res.data.length;
          const pages = res.totalPages ?? Math.ceil(total / size);
          return {
            content: res.data,
            totalElements: total,
            totalPages: pages || 1,
            size: size,
            number: page
          };
        }
        return {
          content: [],
          totalElements: 0,
          totalPages: 0,
          size: size,
          number: page
        };
      })
    );
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
