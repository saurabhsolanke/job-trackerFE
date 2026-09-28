import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Company } from '../models/company.model';
import { PageResponse } from '../models/application.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private readonly API_URL = `${environment.apiUrl}/companies`;

  constructor(private http: HttpClient) {}

  getCompanies(
    q?: string,
    page: number = 0,
    size: number = 10
  ): Observable<PageResponse<Company>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (q) {
      params = params.set('q', q);
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

  createCompany(company: Company): Observable<Company> {
    return this.http.post<Company>(this.API_URL, company);
  }
}
