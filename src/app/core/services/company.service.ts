import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from '../models/company.model';
import { PageResponse } from '../models/application.model';

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private readonly API_URL = 'http://localhost:8080/api/companies';

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

    return this.http.get<PageResponse<Company>>(this.API_URL, { params });
  }

  createCompany(company: Company): Observable<Company> {
    return this.http.post<Company>(this.API_URL, company);
  }
}
