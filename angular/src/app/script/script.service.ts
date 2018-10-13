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
      return this.http.get<Script[]>('/api/scripts');
    }
  
    getScriptById(scriptID): Observable<Script> {
      return this.http.get<Script>('/api/scripts/' + scriptID)
    }
  
    postScript(script: Script): Observable<Script> {
      return this.http.post<Script>('/api/scripts/', script);
    }
  
    updateScript(script: Script): Observable<Script> {
      return this.http.put<Script>('/api/scripts', script);
    }
  
    deleteScript(scriptID) {
      return this.http.delete('/api/scripts/' + scriptID);
    }
    
}