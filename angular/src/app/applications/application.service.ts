import { Injectable } from '@angular/core';
import { Application } from '../applications/application.model'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor(private http: HttpClient) { }

  getAllApplications(): Observable<Application[]> {
    return this.http.get<Application[]>('/api/application');
  }

  getApplicationById(applicationID): Observable<Application> {
    return this.http.get<Application>('/api/application/' + applicationID)
  }

  postApplication(application: Application): Observable<Application> {
    return this.http.post<Application>('/api/application', application);
  }

  updateApplication(application: Application): Observable<Application> {
    return this.http.put<Application>('/api/application', application);
  }

  deleteApplication(applicationID) {
    return this.http.delete('/api/application/' + applicationID);
  }
  
}