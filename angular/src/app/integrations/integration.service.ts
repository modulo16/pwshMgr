import { SlackIntegration } from './integration.model'
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class IntegrationService {

  constructor(private http: HttpClient) {}

    getAllIntegrations(): Observable<SlackIntegration[]> {
      return this.http.get<SlackIntegration[]>('/api/integrations');
    }
  
    getIntegrationById(integrationID): Observable<SlackIntegration> {
      return this.http.get<SlackIntegration>('/api/integrations/' + integrationID)
    }
  
    postIntegration(integration: SlackIntegration): Observable<SlackIntegration> {
      return this.http.post<SlackIntegration>('/api/integrations/', integration);
    }
  
    updateIntegration(integration: SlackIntegration): Observable<SlackIntegration> {
      return this.http.put<SlackIntegration>('/api/integrations', integration);
    }
  
    deleteIntegration(integrationID) {
      return this.http.delete('/api/integrations/' + integrationID);
    }

}