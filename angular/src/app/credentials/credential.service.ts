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
    return this.http.get<Credential[]>('/api/credential');
  }

  getCredentialById(credentialID): Observable<Credential> {
    return this.http.get<Credential>('/api/credential/' + credentialID)
  }

  postCredential(credential: Credential): Observable<Credential> {
    return this.http.post<Credential>('/api/credential', credential);
  }

  updateCredential(credential: Credential): Observable<Credential> {
    return this.http.put<Credential>('/api/credential', credential);
  }

  deleteCredential(credentialID) {
    return this.http.delete('/api/credential/' + credentialID);
  }

  refresh(credentialID): Observable<Credential> {
    return this.http.get<Credential>('/api/credential/update/' + credentialID);
  }

}