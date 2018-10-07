import { Injectable } from '@angular/core';
import { User } from './user.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/user');
  }

  getUserById(userID): Observable<User> {
    return this.http.get<User>('/api/user/' + userID)
  }

  postUser(user: User): Observable<User> {
    return this.http.post<User>('/api/user', user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>('/api/user', user);
  }

  deleteUser(userID) {
    return this.http.delete('/api/user/' + userID);
  }

}