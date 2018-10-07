import { Group } from './group.model'
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http: HttpClient) {}

    getAllGroups(): Observable<Group[]> {
      return this.http.get<Group[]>('/api/group');
    }
  
    getGroupById(groupID): Observable<Group> {
      return this.http.get<Group>('/api/group/' + groupID)
    }
  
    postGroup(group: Group): Observable<Group> {
      return this.http.post<Group>('/api/group/', group);
    }
  
    updateGroup(group: Group): Observable<Group> {
      return this.http.put<Group>('/api/group', group);
    }
  
    deleteGroup(groupID) {
      return this.http.delete('/api/group/' + groupID);
    }

}