import { Script } from './script.model'
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ScriptService {

  constructor(private http: HttpClient) {}

    getAllScripts(): Observable<Script[]> {
      return this.http.get<Script[]>('/api/script');
    }
  
    getScriptById(scriptID): Observable<Script> {
      return this.http.get<Script>('/api/script/' + scriptID)
    }
  
    postScript(script: Script): Observable<Script> {
      return this.http.post<Script>('/api/script/', script);
    }
  
    updateScript(script: Script): Observable<Script> {
      return this.http.put<Script>('/api/script', script);
    }
  
    deleteScript(scriptID) {
      return this.http.delete('/api/script/' + scriptID);
    }
    
}