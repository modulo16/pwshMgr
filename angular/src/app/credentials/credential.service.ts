import { Injectable } from '@angular/core';
import { Credential } from './credential.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CredentialService {

  constructor(private http: HttpClient) {}

  getAllCredentials(): Observable<Credential[]> {
    return this.http.get<Credential[]>('/api/credentials');
  }

  getCredentialById(credentialID): Observable<Credential> {
    return this.http.get<Credential>('/api/credentials/' + credentialID)
  }

  postCredential(credential: Credential): Observable<Credential> {
    return this.http.post<Credential>('/api/credentials', credential);
  }

  updateCredential(credential: Credential): Observable<Credential> {
    return this.http.put<Credential>('/api/credentials', credential);
  }

  deleteCredential(credentialID) {
    return this.http.delete('/api/credentials/' + credentialID);
  }

  refresh(credentialID): Observable<Credential> {
    return this.http.get<Credential>('/api/credentials/update/' + credentialID);
  }

}